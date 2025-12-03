// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../src/SkillTrial.sol";
import "forge-std/Test.sol";
import "./UserRegistry.t.sol";

contract SkillTrialTest is Test {
    SkillTrial public skillTrial;
    MockUSDC public usdc;
    address public oracle;
    
    address public client = address(0x1);
    address public freelancer = address(0x2);
    
    function setUp() public {
        usdc = new MockUSDC();
        oracle = address(0x999);
        
        skillTrial = new SkillTrial(address(usdc), oracle);
        
        usdc.mint(client, 10000 * 10**6);
    }
    
    function testCreateTrial() public {
        vm.prank(client);
        usdc.approve(address(skillTrial), 50 * 10**6);
        
        vm.prank(client);
        uint256 trialId = skillTrial.createTrial(
            freelancer,
            "React Development",
            "Build a todo app",
            50 * 10**6
        );
        
        (address trialClient, address trialFreelancer,,,, uint256 aiScore) = 
            skillTrial.getTrial(trialId);
        
        assertEq(trialClient, client);
        assertEq(trialFreelancer, freelancer);
        assertEq(aiScore, 0);
    }
    
    function testSubmitTrial() public {
        vm.prank(client);
        usdc.approve(address(skillTrial), 50 * 10**6);
        
        vm.prank(client);
        uint256 trialId = skillTrial.createTrial(
            freelancer,
            "React Development",
            "Build a todo app",
            50 * 10**6
        );
        
        vm.prank(freelancer);
        skillTrial.submitTrial(trialId);
        
        (,,,, SkillTrial.TrialStatus status,) = skillTrial.getTrial(trialId);
        assertEq(uint(status), uint(SkillTrial.TrialStatus.Submitted));
    }
    
    function testFulfillAIScoringPass() public {
        // Create and submit trial
        vm.prank(client);
        usdc.approve(address(skillTrial), 50 * 10**6);
        
        vm.prank(client);
        uint256 trialId = skillTrial.createTrial(
            freelancer,
            "React Development",
            "Build a todo app",
            50 * 10**6
        );
        
        vm.prank(freelancer);
        skillTrial.submitTrial(trialId);
        
        // Oracle fulfills with passing score
        uint256 balanceBefore = usdc.balanceOf(freelancer);
        
        vm.prank(oracle);
        skillTrial.fulfillAIScoring(trialId, 85);
        
        uint256 balanceAfter = usdc.balanceOf(freelancer);
        assertEq(balanceAfter - balanceBefore, 50 * 10**6);
        
        // Check badge minted
        uint256[] memory badges = skillTrial.getFreelancerBadges(freelancer);
        assertEq(badges.length, 1);
    }
    
    function testFulfillAIScoringFail() public {
        vm.prank(client);
        usdc.approve(address(skillTrial), 50 * 10**6);
        
        vm.prank(client);
        uint256 trialId = skillTrial.createTrial(
            freelancer,
            "React Development",
            "Build a todo app",
            50 * 10**6
        );
        
        vm.prank(freelancer);
        skillTrial.submitTrial(trialId);
        
        // Oracle fulfills with failing score
        uint256 clientBalanceBefore = usdc.balanceOf(client);
        
        vm.prank(oracle);
        skillTrial.fulfillAIScoring(trialId, 50);
        
        uint256 clientBalanceAfter = usdc.balanceOf(client);
        assertEq(clientBalanceAfter - clientBalanceBefore, 50 * 10**6);
    }
}