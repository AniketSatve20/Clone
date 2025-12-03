// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/interfaces/IZKVerifier.sol";
import "../src/UserRegistry.sol";
import "../src/ProjectEscrow.sol";
import "../src/SkillTrial.sol";
import "../src/DisputeJury.sol";
import "../src/InsurancePool.sol";
import "../src/GasSponsor.sol";
import "../src/EnterpriseAccess.sol";

/**
 * @title Deploy
 * @notice Complete deployment script for HumanWork Protocol
 * @dev Deploys all contracts in correct order with proper initialization
 */
contract Deploy is Script {
    // Deployed contract addresses
    address public zkVerifier;
    address public stablecoin;
    UserRegistry public userRegistry;
    ProjectEscrow public projectEscrow;
    SkillTrial public skillTrial;
    DisputeJury public disputeJury;
    InsurancePool public insurancePool;
    GasSponsor public gasSponsor;
    EnterpriseAccess public enterpriseAccess;
    
    address public oracle;
    
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Load external addresses (these should be deployed separately or mock addresses for testing)
        zkVerifier = vm.envAddress("ZK_VERIFIER_ADDRESS");
        stablecoin = vm.envAddress("STABLECOIN_ADDRESS"); // e.g., USDC on Hedera
        oracle = vm.envAddress("ORACLE_ADDRESS"); // Chainlink/Pyth oracle
        
        console.log("=====================================");
        console.log("HumanWork Protocol Deployment");
        console.log("=====================================");
        console.log("Deployer:", deployer);
        console.log("Network: Hedera Testnet");
        console.log("ZK Verifier:", zkVerifier);
        console.log("Stablecoin:", stablecoin);
        console.log("Oracle:", oracle);
        console.log("=====================================");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // ============ Step 1: Deploy GasSponsor ============
        console.log("\n1. Deploying GasSponsor...");
        gasSponsor = new GasSponsor(stablecoin);
        console.log("   GasSponsor deployed at:", address(gasSponsor));
        
        // ============ Step 2: Deploy UserRegistry ============
        console.log("\n2. Deploying UserRegistry...");
        userRegistry = new UserRegistry(
            zkVerifier,
            stablecoin,
            address(gasSponsor)
        );
        console.log("   UserRegistry deployed at:", address(userRegistry));
        
        // ============ Step 3: Deploy DisputeJury ============
        console.log("\n3. Deploying DisputeJury...");
        disputeJury = new DisputeJury(
            stablecoin,
            address(userRegistry)
        );
        console.log("   DisputeJury deployed at:", address(disputeJury));
        
        // ============ Step 4: Deploy ProjectEscrow ============
        console.log("\n4. Deploying ProjectEscrow...");
        projectEscrow = new ProjectEscrow(
            stablecoin,
            address(userRegistry)
        );
        console.log("   ProjectEscrow deployed at:", address(projectEscrow));
        
        // ============ Step 5: Deploy SkillTrial ============
        console.log("\n5. Deploying SkillTrial...");
        skillTrial = new SkillTrial(
            stablecoin,
            oracle
        );
        console.log("   SkillTrial deployed at:", address(skillTrial));
        
        // ============ Step 6: Deploy InsurancePool ============
        console.log("\n6. Deploying InsurancePool...");
        insurancePool = new InsurancePool(stablecoin);
        console.log("   InsurancePool deployed at:", address(insurancePool));
        
        // ============ Step 7: Deploy EnterpriseAccess ============
        console.log("\n7. Deploying EnterpriseAccess...");
        enterpriseAccess = new EnterpriseAccess(stablecoin);
        console.log("   EnterpriseAccess deployed at:", address(enterpriseAccess));
        
        // ============ Post-Deployment Configuration ============
        console.log("\n=====================================");
        console.log("Post-Deployment Configuration");
        console.log("=====================================");
        
        // Link DisputeJury to ProjectEscrow
        console.log("\n8. Linking DisputeJury to ProjectEscrow...");
        disputeJury.setProjectEscrowAddress(address(projectEscrow));
        console.log("    - DisputeJury linked");
        
        // Link ProjectEscrow to DisputeJury
        console.log("\n9. Linking ProjectEscrow to DisputeJury...");
        projectEscrow.setDisputeJuryAddress(address(disputeJury));
        console.log("   - ProjectEscrow linked");
        
        // Authorize contracts in GasSponsor
        console.log("\n10. Authorizing contracts in GasSponsor...");
        gasSponsor.authorizeContract(address(userRegistry), true);
        gasSponsor.authorizeContract(address(projectEscrow), true);
        gasSponsor.authorizeContract(address(skillTrial), true);
        console.log("   - Contracts authorized");
        
        vm.stopBroadcast();
        
        // ============ Deployment Summary ============
        console.log("\n=====================================");
        console.log("DEPLOYMENT COMPLETE");
        console.log("=====================================");
        console.log("UserRegistry:      ", address(userRegistry));
        console.log("ProjectEscrow:     ", address(projectEscrow));
        console.log("SkillTrial:        ", address(skillTrial));
        console.log("DisputeJury:       ", address(disputeJury));
        console.log("InsurancePool:     ", address(insurancePool));
        console.log("GasSponsor:        ", address(gasSponsor));
        console.log("EnterpriseAccess:  ", address(enterpriseAccess));
        console.log("=====================================");
        
        // Save deployment addresses to file
        _saveDeployment();
    }
    
    function _saveDeployment() internal {
        string memory json = string(abi.encodePacked(
            '{\n',
            '  "network": "hedera_testnet",\n',
            '  "timestamp": ', vm.toString(block.timestamp), ',\n',
            '  "deployer": "', vm.toString(msg.sender), '",\n',
            '  "contracts": {\n',
            '    "UserRegistry": "', vm.toString(address(userRegistry)), '",\n',
            '    "ProjectEscrow": "', vm.toString(address(projectEscrow)), '",\n',
            '    "SkillTrial": "', vm.toString(address(skillTrial)), '",\n',
            '    "DisputeJury": "', vm.toString(address(disputeJury)), '",\n',
            '    "InsurancePool": "', vm.toString(address(insurancePool)), '",\n',
            '    "GasSponsor": "', vm.toString(address(gasSponsor)), '",\n',
            '    "EnterpriseAccess": "', vm.toString(address(enterpriseAccess)), '"\n',
            '  },\n',
            '  "external": {\n',
            '    "zkVerifier": "', vm.toString(zkVerifier), '",\n',
            '    "stablecoin": "', vm.toString(stablecoin), '",\n',
            '    "oracle": "', vm.toString(oracle), '"\n',
            '  }\n',
            '}\n'
        ));
        
        vm.writeFile("deployments/hedera_testnet.json", json);
        console.log("\n- Deployment addresses saved to deployments/hedera_testnet.json");
    }
}