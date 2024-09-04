// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Cuchulink {
	struct Participant {
		bool hasPaid;
		uint256 totalPaid;
	}

	struct Round {
		address winner;
		bool hasWinner;
	}

	struct Cuchubal {
		string nombre;
		uint256 montoPorRonda; // Monto en Wei
		uint256 fechaInicio;
		uint256 fechaFinalizacion;
		uint256 numParticipantes;
		uint256 rondaActual;
		uint256 participantesPagados;
		mapping(address => Participant) participants;
		mapping(uint256 => Round) rounds; // Historial de rondas
		mapping(uint256 => address) participantIndex; // Almacenar participantes con índices
	}

	mapping(string => Cuchubal) private cuchubales;
	mapping(address => string[]) private creatorToCuchubales;

	event CuchubalCreated(
		string codigo,
		string nombre,
		uint256 montoPorRonda,
		uint256 fechaInicio,
		uint256 numParticipantes,
		address creador
	);
	event ParticipantJoined(string codigo, address participant);
	event PaymentMade(string codigo, address participant, uint256 amount);
	event RoundCompleted(string codigo, uint256 rondaActual, address winner);

	modifier onlyCreator(string memory codigo) {
		require(
			cuchubales[codigo].participants[msg.sender].hasPaid,
			"Only creator can call this function"
		);
		_;
	}

	modifier onlyParticipant(string memory codigo) {
		require(
			cuchubales[codigo].participants[msg.sender].hasPaid,
			"Only participants can call this function"
		);
		_;
	}

	function createCuchubal(
		string memory nombre,
		uint256 montoPorRonda, // En Wei
		uint256 fechaInicio,
		uint256 numParticipantes,
		string memory codigo
	) public payable {
		require(
			msg.value == montoPorRonda,
			"Initial payment must be equal to montoPorRonda"
		);

		Cuchubal storage newCuchubal = cuchubales[codigo];
		newCuchubal.nombre = nombre;
		newCuchubal.montoPorRonda = montoPorRonda;
		newCuchubal.fechaInicio = fechaInicio;
		newCuchubal.fechaFinalizacion =
			fechaInicio +
			(2 * numParticipantes * 1 weeks);
		newCuchubal.numParticipantes = numParticipantes;
		newCuchubal.rondaActual = 1;
		newCuchubal.participantesPagados = 1;
		newCuchubal.participants[msg.sender] = Participant({
			hasPaid: true,
			totalPaid: msg.value
		});
		newCuchubal.rounds[newCuchubal.rondaActual] = Round({
			winner: address(0),
			hasWinner: false
		});
		newCuchubal.participantIndex[newCuchubal.participantesPagados] = msg
			.sender;

		creatorToCuchubales[msg.sender].push(codigo);

		emit CuchubalCreated(
			codigo,
			nombre,
			montoPorRonda,
			fechaInicio,
			numParticipantes,
			msg.sender
		);
		emit PaymentMade(codigo, msg.sender, msg.value);
	}

	function joinCuchubal(string memory codigo) public payable {
		Cuchubal storage cuchubal = cuchubales[codigo];
		require(cuchubal.fechaInicio != 0, "Cuchubal not found");

		Participant storage participant = cuchubal.participants[msg.sender];
		bool isNewParticipant = !participant.hasPaid;
		require(
			isNewParticipant || cuchubal.rondaActual > 1,
			"You have already paid for this round"
		);
		require(
			cuchubal.participantesPagados < cuchubal.numParticipantes,
			"Cuchubal is full"
		);
		require(
			msg.value == cuchubal.montoPorRonda,
			"Payment must be equal to montoPorRonda"
		);

		if (isNewParticipant) {
			cuchubal.participants[msg.sender] = Participant({
				hasPaid: true,
				totalPaid: msg.value
			});
			cuchubal.participantesPagados++;
			cuchubal.participantIndex[cuchubal.participantesPagados] = msg
				.sender;
		} else {
			participant.hasPaid = true;
			participant.totalPaid += msg.value;
		}

		emit ParticipantJoined(codigo, msg.sender);
		emit PaymentMade(codigo, msg.sender, msg.value);

		if (cuchubal.participantesPagados == cuchubal.numParticipantes) {
			distributePayment(codigo);
		}
	}

	function distributePayment(string memory codigo) private {
		Cuchubal storage cuchubal = cuchubales[codigo];
		uint256 totalAmount = cuchubal.montoPorRonda *
			cuchubal.numParticipantes;

		// Seleccionar ganador
		if (cuchubal.participantesPagados == cuchubal.numParticipantes) {
			uint256 randIndex = uint256(
				keccak256(abi.encodePacked(block.timestamp, block.difficulty))
			) % cuchubal.numParticipantes;
			address winner = cuchubal.participantIndex[randIndex + 1]; // Índice comienza en 1

			// Transferir al ganador
			(bool success, ) = payable(winner).call{ value: totalAmount }("");
			require(success, "Transfer failed.");

			cuchubal.rounds[cuchubal.rondaActual] = Round({
				winner: winner,
				hasWinner: true
			});
			emit RoundCompleted(codigo, cuchubal.rondaActual, winner);

			// Restablecer pagos para la siguiente ronda
			for (uint256 i = 1; i <= cuchubal.numParticipantes; i++) {
				address participantAddr = cuchubal.participantIndex[i];
				cuchubal.participants[participantAddr].hasPaid = false;
			}

			cuchubal.rondaActual++;
			cuchubal.participantesPagados = 0;
		}
	}

	function getCuchubalesByCreator(
		address creator
	) public view returns (string[] memory) {
		return creatorToCuchubales[creator];
	}

	function getCuchubalInfo(
		string memory codigo
	)
		public
		view
		returns (
			string memory nombre,
			uint256 montoPorRonda,
			uint256 fechaInicio,
			uint256 fechaFinalizacion,
			uint256 numParticipantes,
			uint256 rondaActual
		)
	{
		Cuchubal storage cuchubal = cuchubales[codigo];
		return (
			cuchubal.nombre,
			cuchubal.montoPorRonda,
			cuchubal.fechaInicio,
			cuchubal.fechaFinalizacion,
			cuchubal.numParticipantes,
			cuchubal.rondaActual
		);
	}

	function getParticipantsPaid(
		string memory codigo
	) public view returns (address[] memory, Participant[] memory) {
		Cuchubal storage cuchubal = cuchubales[codigo];
		address[] memory addresses = new address[](
			cuchubal.participantesPagados
		);
		Participant[] memory participants = new Participant[](
			cuchubal.participantesPagados
		);
		for (uint256 i = 1; i <= cuchubal.participantesPagados; i++) {
			address participantAddr = cuchubal.participantIndex[i];
			addresses[i - 1] = participantAddr;
			participants[i - 1] = cuchubal.participants[participantAddr];
		}
		return (addresses, participants);
	}

	function getParticipants(
		string memory codigo
	) public view returns (address[] memory, Participant[] memory) {
		Cuchubal storage cuchubal = cuchubales[codigo];
		uint256 totalParticipants = cuchubal.numParticipantes; // Obtener el total de participantes

		address[] memory addresses = new address[](totalParticipants);
		Participant[] memory participants = new Participant[](
			totalParticipants
		);

		for (uint256 i = 1; i <= totalParticipants; i++) {
			address participantAddr = cuchubal.participantIndex[i];
			addresses[i - 1] = participantAddr;
			participants[i - 1] = cuchubal.participants[participantAddr];
		}

		return (addresses, participants);
	}

	function getRoundHistory(
		string memory codigo
	) public view returns (Round[] memory) {
		Cuchubal storage cuchubal = cuchubales[codigo];
		Round[] memory rounds = new Round[](cuchubal.rondaActual);
		for (uint256 i = 1; i <= cuchubal.rondaActual; i++) {
			rounds[i - 1] = cuchubal.rounds[i];
		}
		return rounds;
	}
}
