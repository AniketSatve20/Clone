// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/utils/ReentrancyGuard.sol";
import "./UserRegistry.sol";

/**
 * @title DisputeJury
 * @notice Decentralized jury system for dispute resolution
 * @dev Jurors must be Level 2 Verified Humans with staked tokens
 */
contract DisputeJury is ReentrancyGuard {
    // ============ State Variables ============
    
    IERC20 public immutable stablecoin;
    UserRegistry public immutable userRegistry;
    address public projectEscrowAddress;
    
    uint256 public constant MIN_STAKE = 100 * 10**6; // 100 USDC
    uint256 public constant JURORS_PER_CASE = 5;
    uint256 public constant VOTING_PERIOD = 7 days;
    
    uint256 public disputeCounter;
    
    enum DisputeOutcome {
        Pending,
        ClientWins,
        FreelancerWins
    }
    
    struct Dispute {
        uint256 projectId;
        uint256 milestoneIndex;
        address client;
        address freelancer;
        uint256 amount;
        address[] jurors;
        mapping(address => bool) hasVoted;
        uint256 votesForClient;
        uint256 votesForFreelancer;
        DisputeOutcome outcome;
        uint256 createdAt;
        uint256 resolvedAt;
        bool fundsDistributed;
    }
    
    struct JurorInfo {
        uint256 stakedAmount;
        uint256 casesJudged;
        uint256 reputationScore;
        bool isActive;
    }
    
    // ============ Storage ============
    
    mapping(uint256 => Dispute) public disputes;
    mapping(address => JurorInfo) public jurors;
    address[] public activeJurors;
    
    // ============ Events ============
    
    event DisputeCreated(uint256 indexed disputeId, uint256 projectId, uint256 milestoneIndex, uint256 amount);
    event JurorStaked(address indexed juror, uint256 amount);
    event JurorUnstaked(address indexed juror, uint256 amount);
    event VoteCast(uint256 indexed disputeId, address indexed juror, bool votedForClient);
    event DisputeResolved(uint256 indexed disputeId, DisputeOutcome outcome);
    event RewardDistributed(address indexed juror, uint256 amount);
    
    // ============ Errors ============
    
    error NotVerifiedHuman();
    error InsufficientStake();
    error AlreadyVoted();
    error VotingEnded();
    error NotJurorInCase();
    error DisputeNotResolved();
    error FundsAlreadyDistributed();
    error NotEnoughJurors();
    
    // ============ Constructor ============
    
    constructor(address _stablecoin, address _userRegistry) {
        stablecoin = IERC20(_stablecoin);
        userRegistry = UserRegistry(_userRegistry);
    }
    
    // ============ External Functions ============
    
    /**
     * @notice Stake tokens to become a juror
     */
    function stakeAsJuror(uint256 amount) external nonReentrant {
        if (!userRegistry.isVerifiedHuman(msg.sender)) {
            revert NotVerifiedHuman();
        }
        if (amount < MIN_STAKE) {
            revert InsufficientStake();
        }
        
        require(
            stablecoin.transferFrom(msg.sender, address(this), amount),
            "Stake transfer failed"
        );
        
        JurorInfo storage juror = jurors[msg.sender];
        
        if (juror.stakedAmount == 0) {
            activeJurors.push(msg.sender);
            juror.reputationScore = 100; // Starting reputation
        }
        
        juror.stakedAmount += amount;
        juror.isActive = true;
        
        emit JurorStaked(msg.sender, amount);
    }
    
    /**
     * @notice Unstake tokens (can only unstake if not in active cases)
     */
    function unstake(uint256 amount) external nonReentrant {
        JurorInfo storage juror = jurors[msg.sender];
        
        if (juror.stakedAmount < amount) {
            revert InsufficientStake();
        }
        
        juror.stakedAmount -= amount;
        
        if (juror.stakedAmount < MIN_STAKE) {
            juror.isActive = false;
        }
        
        require(
            stablecoin.transfer(msg.sender, amount),
            "Unstake transfer failed"
        );
        
        emit JurorUnstaked(msg.sender, amount);
    }
    
    /**
     * @notice Create a new dispute (called by ProjectEscrow)
     */
    function createDispute(
        uint256 projectId,
        uint256 milestoneIndex,
        address client,
        address freelancer,
        uint256 amount
    ) external returns (uint256) {
        require(msg.sender == projectEscrowAddress, "Only ProjectEscrow");
        
        if (activeJurors.length < JURORS_PER_CASE) {
            revert NotEnoughJurors();
        }
        
        uint256 disputeId = disputeCounter++;
        Dispute storage dispute = disputes[disputeId];
        
        dispute.projectId = projectId;
        dispute.milestoneIndex = milestoneIndex;
        dispute.client = client;
        dispute.freelancer = freelancer;
        dispute.amount = amount;
        dispute.outcome = DisputeOutcome.Pending;
        dispute.createdAt = block.timestamp;
        dispute.fundsDistributed = false;
        
        // Select random jurors (simplified - use Chainlink VRF in production)
        dispute.jurors = _selectJurors();
        
        emit DisputeCreated(disputeId, projectId, milestoneIndex, amount);
        
        return disputeId;
    }
    
    /**
     * @notice Juror casts vote on a dispute
     * @param disputeId The dispute ID
     * @param voteForClient True if voting for client, false for freelancer
     */
    function castVote(uint256 disputeId, bool voteForClient) external {
        Dispute storage dispute = disputes[disputeId];
        
        if (block.timestamp > dispute.createdAt + VOTING_PERIOD) {
            revert VotingEnded();
        }
        if (dispute.hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }
        if (!_isJurorInCase(disputeId, msg.sender)) {
            revert NotJurorInCase();
        }
        
        dispute.hasVoted[msg.sender] = true;
        
        if (voteForClient) {
            dispute.votesForClient++;
        } else {
            dispute.votesForFreelancer++;
        }
        
        emit VoteCast(disputeId, msg.sender, voteForClient);
        
        // Check if all jurors have voted
        if (dispute.votesForClient + dispute.votesForFreelancer == JURORS_PER_CASE) {
            _tallyVotes(disputeId);
        }
    }
    
    /**
     * @notice Finalize dispute after voting period ends
     */
    function finalizeDispute(uint256 disputeId) external {
        Dispute storage dispute = disputes[disputeId];
        
        if (block.timestamp <= dispute.createdAt + VOTING_PERIOD) {
            revert VotingEnded();
        }
        if (dispute.outcome != DisputeOutcome.Pending) {
            revert DisputeNotResolved();
        }
        
        _tallyVotes(disputeId);
    }
    
    // ============ Internal Functions ============
    
    function _tallyVotes(uint256 disputeId) internal {
        Dispute storage dispute = disputes[disputeId];
        
        if (dispute.votesForClient > dispute.votesForFreelancer) {
            dispute.outcome = DisputeOutcome.ClientWins;
        } else {
            dispute.outcome = DisputeOutcome.FreelancerWins;
        }
        
        dispute.resolvedAt = block.timestamp;
        
        emit DisputeResolved(disputeId, dispute.outcome);
        
        // Distribute funds to winner and jurors
        _distributeFunds(disputeId);
    }
    
    function _distributeFunds(uint256 disputeId) internal nonReentrant {
        Dispute storage dispute = disputes[disputeId];
        
        if (dispute.fundsDistributed) {
            revert FundsAlreadyDistributed();
        }
        
        dispute.fundsDistributed = true;
        
        uint256 totalAmount = dispute.amount;
        uint256 jurorReward = totalAmount / 10; // 10% total to jurors
        uint256 perJurorReward = jurorReward / JURORS_PER_CASE;
        uint256 winnerAmount = totalAmount - jurorReward;
        
        address winner = dispute.outcome == DisputeOutcome.ClientWins 
            ? dispute.client 
            : dispute.freelancer;
        
        // Pay winner
        require(
            stablecoin.transfer(winner, winnerAmount),
            "Winner payment failed"
        );
        
        // Pay jurors who voted for winning side
        bool clientWon = dispute.outcome == DisputeOutcome.ClientWins;
        
        for (uint256 i = 0; i < dispute.jurors.length; i++) {
            address juror = dispute.jurors[i];
            bool votedForWinner = dispute.hasVoted[juror] && 
                ((clientWon && _votedForClient(disputeId, juror)) || 
                 (!clientWon && !_votedForClient(disputeId, juror)));
            
            if (votedForWinner) {
                require(
                    stablecoin.transfer(juror, perJurorReward),
                    "Juror payment failed"
                );
                
                jurors[juror].casesJudged++;
                jurors[juror].reputationScore += 5;
                
                emit RewardDistributed(juror, perJurorReward);
            } else if (dispute.hasVoted[juror]) {
                // Penalize jurors who voted for losing side
                jurors[juror].reputationScore = jurors[juror].reputationScore > 10 
                    ? jurors[juror].reputationScore - 10 
                    : 0;
            }
        }
    }
    
    function _selectJurors() internal view returns (address[] memory) {
        address[] memory selected = new address[](JURORS_PER_CASE);
        uint256 count = 0;
        
        // Simplified selection - use weighted random with Chainlink VRF in production
        uint256 startIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % activeJurors.length;
        
        for (uint256 i = 0; i < activeJurors.length && count < JURORS_PER_CASE; i++) {
            uint256 index = (startIndex + i) % activeJurors.length;
            address juror = activeJurors[index];
            
            if (jurors[juror].isActive && jurors[juror].stakedAmount >= MIN_STAKE) {
                selected[count] = juror;
                count++;
            }
        }
        
        return selected;
    }
    
    function _isJurorInCase(uint256 disputeId, address juror) internal view returns (bool) {
        Dispute storage dispute = disputes[disputeId];
        
        for (uint256 i = 0; i < dispute.jurors.length; i++) {
            if (dispute.jurors[i] == juror) {
                return true;
            }
        }
        
        return false;
    }
    
    function _votedForClient(uint256 disputeId, address juror) internal view returns (bool) {
        // This is a simplified check - in production, store vote choices
        return disputes[disputeId].votesForClient > 0;
    }
    
    // ============ View Functions ============
    
    function getDispute(uint256 disputeId) external view returns (
        uint256 projectId,
        address client,
        address freelancer,
        uint256 amount,
        DisputeOutcome outcome,
        uint256 votesForClient,
        uint256 votesForFreelancer
    ) {
        Dispute storage dispute = disputes[disputeId];
        return (
            dispute.projectId,
            dispute.client,
            dispute.freelancer,
            dispute.amount,
            dispute.outcome,
            dispute.votesForClient,
            dispute.votesForFreelancer
        );
    }
    
    function getJurorInfo(address juror) external view returns (
        uint256 stakedAmount,
        uint256 casesJudged,
        uint256 reputationScore,
        bool isActive
    ) {
        JurorInfo storage info = jurors[juror];
        return (
            info.stakedAmount,
            info.casesJudged,
            info.reputationScore,
            info.isActive
        );
    }
    
    function getActiveJurorCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < activeJurors.length; i++) {
            if (jurors[activeJurors[i]].isActive) {
                count++;
            }
        }
        return count;
    }
    
    // ============ Admin Functions ============
    
    function setProjectEscrowAddress(address _projectEscrow) external {
        require(projectEscrowAddress == address(0), "Already set");
        projectEscrowAddress = _projectEscrow;
    }
}