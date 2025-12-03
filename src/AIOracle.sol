// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./AgencyRegistry.sol";
import "./SkillTrial.sol";

/**
 * @title AIOracle V5
 * @notice Centralized "brain" for AI verification tasks
 * @dev Manages off-chain AI workers and posts results on-chain
 */
contract AIOracle is Ownable {
    // ============ State Variables ============

    AgencyRegistry public agencyRegistry;
    SkillTrial public skillTrial;
    
    // --- THIS IS THE FIX ---
    // Added the missing address variable that the test is checking
    address public skillTrialAddress;
    // --- END FIX ---

    uint256 public jobCounter;

    enum JobType { GST_VERIFICATION, SKILL_GRADING }
    enum JobStatus { Pending, Completed, Failed }

    struct VerificationJob {
        uint256 jobId;
        JobType jobType;
        JobStatus status;
        bytes32 requestHash;
        address requester;
        uint256 referenceId; // agencyId or submissionId
        uint256 timestamp;
    }

    // ============ Storage ============

    mapping(uint256 => VerificationJob) public jobs;
    mapping(bytes32 => bool) public requestExists;

    // ============ Events ============

    event JobRequested(uint256 indexed jobId, JobType indexed jobType, uint256 referenceId, bytes32 requestHash);
    event GstVerified(uint256 indexed jobId, uint256 indexed agencyId, bool success);
    event SkillGraded(uint256 indexed jobId, uint256 indexed submissionId, uint8 score);

    // ============ Constructor ============

    constructor(
        address _agencyRegistry,
        address _skillTrial
    ) Ownable(msg.sender) {
        agencyRegistry = AgencyRegistry(_agencyRegistry);
        skillTrial = SkillTrial(_skillTrial);
        skillTrialAddress = _skillTrial; // --- FIX ---
    }

    // ============ Job Request Functions (Called by other contracts) ============

    function requestGstVerification(uint256 agencyId, bytes32 gstHash) external returns (uint256) {
        require(msg.sender == address(agencyRegistry), "Only AgencyRegistry");
        
        bytes32 requestHash = keccak256(abi.encodePacked(agencyId, gstHash));
        require(!requestExists[requestHash], "Duplicate request");

        uint256 jobId = jobCounter++;
        jobs[jobId] = VerificationJob({
            jobId: jobId,
            jobType: JobType.GST_VERIFICATION,
            status: JobStatus.Pending,
            requestHash: requestHash,
            requester: msg.sender,
            referenceId: agencyId,
            timestamp: block.timestamp
        });
        
        requestExists[requestHash] = true;
        emit JobRequested(jobId, JobType.GST_VERIFICATION, agencyId, requestHash);
        return jobId;
    }

    function requestSkillGrade(
        uint256 submissionId,
        address user,
        string memory submissionData
    ) external returns (uint256) {
        require(msg.sender == address(skillTrial), "Only SkillTrial");

        bytes32 requestHash = keccak256(abi.encodePacked(submissionId, user, submissionData));
        require(!requestExists[requestHash], "Duplicate request");

        uint256 jobId = jobCounter++;
        jobs[jobId] = VerificationJob({
            jobId: jobId,
            jobType: JobType.SKILL_GRADING,
            status: JobStatus.Pending,
            requestHash: requestHash,
            requester: user,
            referenceId: submissionId,
            timestamp: block.timestamp
        });

        requestExists[requestHash] = true;
        emit JobRequested(jobId, JobType.SKILL_GRADING, submissionId, requestHash);
        return jobId;
    }

    // ============ Job Fulfillment Functions (OnlyOwner - Backend) ============

    function fulfillGstVerification(uint256 jobId, uint256 agencyId, bool isVerified) external onlyOwner {
        VerificationJob storage job = jobs[jobId];
        require(job.jobType == JobType.GST_VERIFICATION, "Not GST job");
        require(job.status == JobStatus.Pending, "Job not pending");

        job.status = JobStatus.Completed;
        agencyRegistry.setGstVerified(agencyId, isVerified);
        
        emit GstVerified(jobId, agencyId, isVerified);
    }

    // --- THIS IS THE V2 (5-ARGUMENT) FUNCTION ---
    function fulfillSkillGrade(
        uint256 jobId,
        uint256 submissionId,
        address user,
        uint8 score,
        string memory report
    ) external onlyOwner {
        VerificationJob storage job = jobs[jobId];
        require(job.jobType == JobType.SKILL_GRADING, "Not Skill job");
        require(job.status == JobStatus.Pending, "Job not pending");
        
        job.status = JobStatus.Completed;
        skillTrial.mint(user, submissionId, score, report);
        
        emit SkillGraded(jobId, submissionId, score);
    }
    // --- END V2 FUNCTION ---

    // ============ Admin Functions ============

    function setSkillTrial(address _skillTrialAddress) external onlyOwner {
        skillTrial = SkillTrial(_skillTrialAddress);
        skillTrialAddress = _skillTrialAddress; // --- FIX ---
    }

    // ============ View Functions ============
    
    function getJob(uint256 jobId) external view returns (
        JobType jobType,
        JobStatus status,
        bytes32 requestHash,
        address requester,
        uint256 referenceId,
        uint256 timestamp
    ) {
        VerificationJob storage job = jobs[jobId];
        return (
            job.jobType,
            job.status,
            job.requestHash,
            job.requester,
            job.referenceId,
            job.timestamp
        );
    }
}