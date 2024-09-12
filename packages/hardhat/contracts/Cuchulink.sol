// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Cuchulink {
	struct Participant {
		bool hasPaid;
		uint256 totalPaid;
		bool hasJoined;
	}

	struct Round {
		address winner;
		bool hasWinner;
	}

	struct Cuchubal {
		string nombre;
		uint256 montoPorRonda; // Monto en Wei
		uint256 numParticipantes;
		uint256 rondaActual;
		uint256 participantesPagados;
		uint256 participantesRegistrados;
		bool exists;
		bool finished;
		mapping(address => Participant) participants;
		mapping(uint256 => Round) rounds; // Historial de rondas
		mapping(uint256 => address) participantIndex;
	}

	mapping(string => Cuchubal) private cuchubales;
	mapping(address => string[]) private creatorToCuchubales;

	event CuchubalCreated(
		string codigo,
		string nombre,
		uint256 montoPorRonda,
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
		uint256 numParticipantes,
		string memory codigo
	) public payable {
		require(
			!cuchubales[codigo].exists,
			"Cuchubal with this code already exists"
		);
		require(
			msg.value == montoPorRonda,
			"Initial payment must be equal to montoPorRonda"
		);

		Cuchubal storage newCuchubal = cuchubales[codigo];
		newCuchubal.nombre = nombre;
		newCuchubal.exists = true;
		newCuchubal.finished = false;
		newCuchubal.montoPorRonda = montoPorRonda;
		newCuchubal.numParticipantes = numParticipantes;
		newCuchubal.rondaActual = 1;
		newCuchubal.participantesPagados = 1;
		newCuchubal.participants[msg.sender] = Participant({
			hasPaid: true,
			hasJoined: true,
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
			numParticipantes,
			msg.sender
		);
		emit PaymentMade(codigo, msg.sender, msg.value);
	}

	function joinCuchubal(string memory codigo) public payable {
		Cuchubal storage cuchubal = cuchubales[codigo];
		//require(cuchubal.fechaInicio != 0, "Cuchubal not found");

		Participant storage participant = cuchubal.participants[msg.sender];
		require(
			!participant.hasJoined,
			"You are already registered in this Cuchubal"
		);
		require(
			cuchubal.participantesRegistrados < cuchubal.numParticipantes,
			"Cuchubal is full"
		);
		require(
			msg.value == cuchubal.montoPorRonda,
			"Payment must be equal to montoPorRonda"
		);

		cuchubal.participants[msg.sender] = Participant({
			hasPaid: true,
			hasJoined: true,
			totalPaid: msg.value
		});

		cuchubal.participantesRegistrados++;
		cuchubal.participantesPagados++;
		cuchubal.participantIndex[cuchubal.participantesPagados] = msg.sender;

		emit ParticipantJoined(codigo, msg.sender);
		emit PaymentMade(codigo, msg.sender, msg.value);

		if (cuchubal.participantesPagados == cuchubal.numParticipantes) {
			distributePayment(codigo);
		}
	}

	function payForNextRound(string memory codigo) public payable {
		Cuchubal storage cuchubal = cuchubales[codigo];
		//require(cuchubal.rondaActual > 1, "Next round payments not started yet");
		require(cuchubal.rondaActual != 1, "Cannot pay for the next round yet");
		require(
			!cuchubal.participants[msg.sender].hasPaid,
			"You have already paid for this round"
		);
		require(
			cuchubal.numParticipantes != cuchubal.rondaActual,
			"Cuchulink has finished"
		);
		require(
			msg.value == cuchubal.montoPorRonda,
			"Payment must be equal to montoPorRonda"
		);

		cuchubal.participants[msg.sender].hasPaid = true;
		cuchubal.participants[msg.sender].totalPaid += msg.value;
		cuchubal.participantesPagados++;

		emit PaymentMade(codigo, msg.sender, msg.value);

		if (cuchubal.participantesPagados == cuchubal.numParticipantes) {
			distributePayment(codigo);
		}
	}

	function distributePayment(string memory codigo) private {
        Cuchubal storage cuchubal = cuchubales[codigo];
        uint256 totalAmount = cuchubal.montoPorRonda * cuchubal.numParticipantes;

        if (cuchubal.participantesPagados == cuchubal.numParticipantes) {

            address winner = selectWinner(cuchubal);

            (bool success,) = payable(winner).call{value: totalAmount}("");
            require(success, "Transfer failed.");

            cuchubal.rounds[cuchubal.rondaActual] = Round({winner: winner, hasWinner: true});
            emit RoundCompleted(codigo, cuchubal.rondaActual, winner);

            for (uint256 i = 1; i <= cuchubal.numParticipantes; i++) {
                address participantAddr = cuchubal.participantIndex[i];
                cuchubal.participants[participantAddr].hasPaid = false;
            }

            cuchubal.participantesPagados = 0;

            if (cuchubal.rondaActual < cuchubal.numParticipantes) {
                cuchubal.rondaActual++;
            } else {
                cuchubal.finished = true;
            }
        }
    }


    function hasParticipantWonBefore(Cuchubal storage cuchubal, address participant) private view returns (bool) {
        for (uint256 i = 1; i < cuchubal.rondaActual; i++) {
            if (cuchubal.rounds[i].winner == participant) {
                return true;
            }
        }
        return false;
    }

    function selectWinner(Cuchubal storage cuchubal) private view returns (address) {
        bool winnerFound = false;
        address winner;

        while (!winnerFound) {
            // Seleccionar un ganador aleatorio
            uint256 randIndex =
                uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % cuchubal.numParticipantes;
            address potentialWinner = cuchubal.participantIndex[randIndex + 1]; 

            if (!hasParticipantWonBefore(cuchubal, potentialWinner)) {
                winner = potentialWinner;
                winnerFound = true;
            }
        }

        return winner;
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
			uint256 numParticipantes,
			uint256 rondaActual,
			bool finished
		)
	{
		Cuchubal storage cuchubal = cuchubales[codigo];
		return (
			cuchubal.nombre,
			cuchubal.montoPorRonda,
			cuchubal.numParticipantes,
			cuchubal.rondaActual,
			cuchubal.finished
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
		uint256 totalParticipants = cuchubal.numParticipantes;

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
