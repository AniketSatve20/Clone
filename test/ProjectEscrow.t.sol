// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/ProjectEscrow.sol";
import "forge-std/Test.sol";
import "./UserRegistry.t.sol";

contract ProjectEscrowTest is Test {
    ProjectEscrow public escrow;
    UserRegistry public userRegistry;
    MockUSDC public usdc;
    MockZKVerifier public zkVerifier;
    address public gasSponsor;
    
    address public client = address(0x1);
    address public freelancer = address(0x2);
    
    function setUp() public {
        usdc = new MockUSDC();
        zkVerifier = new MockZKVerifier();
        gasSponsor = address(0x999);
        
        userRegistry = new UserRegistry(
            address(zkVerifier),
            address(usdc),
            gasSponsor
        );
        
        escrow = new ProjectEscrow(
            address(usdc),
            address(userRegistry)
        );
        
        // Fund users
        usdc.mint(client, 10000 * 10**6);
        usdc.mint(freelancer, 1000 * 10**6);
    }
    
    function testCreateProject() public {
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000 * 10**6;
        amounts[1] = 1500 * 10**6;
        amounts[2] = 2000 * 10**6;
        
        string[] memory descriptions = new string[](3);
        descriptions[0] = "Milestone 1";
        descriptions[1] = "Milestone 2";
        descriptions[2] = "Milestone 3";
        
        vm.prank(client);
        usdc.approve(address(escrow), 4500 * 10**6);
        
        vm.prank(client);
        uint256 projectId = escrow.createProject(freelancer, amounts, descriptions);
        
        (address projClient, address projFreelancer, uint256 totalAmount,,,) = 
            escrow.getProject(projectId);
        
        assertEq(projClient, client);
        assertEq(projFreelancer, freelancer);
        assertEq(totalAmount, 4500 * 10**6);
    }
    
    function testCannotCreateProjectWithLessThan3Milestones() public {
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1000 * 10**6;
        amounts[1] = 1500 * 10**6;
        
        string[] memory descriptions = new string[](2);
        descriptions[0] = "Milestone 1";
        descriptions[1] = "Milestone 2";
        
        vm.prank(client);
        usdc.approve(address(escrow), 2500 * 10**6);
        
        vm.prank(client);
        vm.expectRevert(ProjectEscrow.InvalidMilestoneCount.selector);
        escrow.createProject(freelancer, amounts, descriptions);
    }
    
    function testCompleteMilestone() public {
        // Create project
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000 * 10**6;
        amounts[1] = 1500 * 10**6;
        amounts[2] = 2000 * 10**6;
        
        string[] memory descriptions = new string[](3);
        descriptions[0] = "Milestone 1";
        descriptions[1] = "Milestone 2";
        descriptions[2] = "Milestone 3";
        
        vm.prank(client);
        usdc.approve(address(escrow), 4500 * 10**6);
        
        vm.prank(client);
        uint256 projectId = escrow.createProject(freelancer, amounts, descriptions);
        
        // Freelancer completes milestone
        vm.prank(freelancer);
        escrow.completeMilestone(projectId, 0);
        
        (,, ProjectEscrow.MilestoneStatus status,) = escrow.getMilestone(projectId, 0);
        assertEq(uint(status), uint(ProjectEscrow.MilestoneStatus.Completed));
    }
    
    function testApproveMilestone() public {
        // Create and complete milestone
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000 * 10**6;
        amounts[1] = 1500 * 10**6;
        amounts[2] = 2000 * 10**6;
        
        string[] memory descriptions = new string[](3);
        descriptions[0] = "M1";
        descriptions[1] = "M2";
        descriptions[2] = "M3";
        
        vm.prank(client);
        usdc.approve(address(escrow), 4500 * 10**6);
        
        vm.prank(client);
        uint256 projectId = escrow.createProject(freelancer, amounts, descriptions);
        
        vm.prank(freelancer);
        escrow.completeMilestone(projectId, 0);
        
        // Client approves
        uint256 balanceBefore = usdc.balanceOf(freelancer);
        
        vm.prank(client);
        escrow.approveMilestone(projectId, 0);
        
        uint256 balanceAfter = usdc.balanceOf(freelancer);
        assertEq(balanceAfter - balanceBefore, 1000 * 10**6);
    }
    
    function testCancelProject() public {
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 1000 * 10**6;
        amounts[1] = 1500 * 10**6;
        amounts[2] = 2000 * 10**6;
        
        string[] memory descriptions = new string[](3);
        descriptions[0] = "M1";
        descriptions[1] = "M2";
        descriptions[2] = "M3";
        
        vm.prank(client);
        usdc.approve(address(escrow), 4500 * 10**6);
        
        vm.prank(client);
        uint256 projectId = escrow.createProject(freelancer, amounts, descriptions);
        
        uint256 balanceBefore = usdc.balanceOf(client);
        
        vm.prank(client);
        escrow.cancelProject(projectId);
        
        uint256 balanceAfter = usdc.balanceOf(client);
        assertEq(balanceAfter - balanceBefore, 4500 * 10**6);
    }
}