// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";
import "../src/AgencyRegistry.sol";
import "../src/AIOracle.sol";
import "../src/SkillTrial.sol";
import "../src/ProjectEscrow.sol";
import "../src/EnterpriseAccess.sol";
import "../src/DisputeJury.sol";
import "../src/GasSponsor.sol";
import "../src/InsurancePool.sol";

contract DeployProtocol is Script {
    // --- FIX: Replaced 0x... with address(0) as a placeholder ---
    address public constant STABLECOIN_ADDRESS = address(0); // REPLACE
    address public constant ZK_VERIFIER_ADDRESS = address(0); // REPLACE
    
    // This will be your backend/admin wallet that controls the AI Oracle
    // and other admin functions.
    address public oracleAdmin; 

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        oracleAdmin = vm.envAddress("ORACLE_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // ============ 1. DEPLOY CORE MODULES ============
        console.log("Deploying Core Modules...");

        GasSponsor gasSponsor = new GasSponsor(STABLECOIN_ADDRESS);
        console.log("  + GasSponsor deployed to:", address(gasSponsor));

        InsurancePool insurancePool = new InsurancePool(STABLECOIN_ADDRESS);
        console.log("  + InsurancePool deployed to:", address(insurancePool));

        // ============ 2. DEPLOY IDENTITY & AI LAYER (L1) ============
        console.log("\nDeploying Identity & AI Layer (L1)...");

        UserRegistry userRegistry = new UserRegistry(
            ZK_VERIFIER_ADDRESS,
            STABLECOIN_ADDRESS,
            address(gasSponsor)
        );
        console.log("  + UserRegistry deployed to:", address(userRegistry));

        AgencyRegistry agencyRegistry = new AgencyRegistry(
            STABLECOIN_ADDRESS,
            address(userRegistry)
        );
        console.log("  + AgencyRegistry deployed to:", address(agencyRegistry));

        AIOracle aiOracle = new AIOracle();
        console.log("  + AIOracle deployed to:", address(aiOracle));

        SkillTrial skillTrial = new SkillTrial(
            STABLECOIN_ADDRESS,
            address(aiOracle),
            address(userRegistry)
        );
        console.log("  + SkillTrial deployed to:", address(skillTrial));

        // ============ 3. DEPLOY COMMERCE & DISPUTE LAYER (L2) ============
        console.log("\nDeploying Commerce & Dispute Layer (L2)...");

        DisputeJury disputeJury = new DisputeJury(
            STABLECOIN_ADDRESS,
            address(userRegistry)
        );
        console.log("  + DisputeJury deployed to:", address(disputeJury));

        EnterpriseAccess enterpriseAccess = new EnterpriseAccess(
            STABLECOIN_ADDRESS
        );
        console.log("  + EnterpriseAccess deployed to:", address(enterpriseAccess));

        ProjectEscrow projectEscrow = new ProjectEscrow(
            STABLECOIN_ADDRESS,
            address(userRegistry),
            address(agencyRegistry),
            address(enterpriseAccess),
            address(disputeJury),
            address(aiOracle)
        );
        console.log("  + ProjectEscrow deployed to:", address(projectEscrow));

        // ============ 4. SET PERMISSIONS & AUTHORIZATIONS ============
        console.log("\nSetting Permissions & Authorizations...");

        // --- AIOracle (The Brain) ---
        // 1. Set the Oracle's admin/owner (your backend server)
        aiOracle.transferOwnership(oracleAdmin);
        console.log("  + AIOracle ownership transferred to:", oracleAdmin);
        // 2. Authorize AIOracle to call AgencyRegistry
        aiOracle.setCallbackAddress(address(agencyRegistry), true);
        console.log("  + AIOracle updated with AgencyRegistry");
        // 3. Authorize AIOracle to call SkillTrial
        aiOracle.setCallbackAddress(address(skillTrial), true);
        console.log("  + AIOracle updated with SkillTrial");
        // 4. Authorize AIOracle to call ProjectEscrow (for dispute reports)
        aiOracle.setCallbackAddress(address(projectEscrow), true);
        console.log("  + AIOracle updated with ProjectEscrow");

        // --- AgencyRegistry (B2B Identity) ---
        // Authorize the AIOracle to set GST verification status
        agencyRegistry.setAIOracle(address(aiOracle));
        console.log("  + AgencyRegistry updated with AIOracle");

        // --- SkillTrial (Vetting) ---
        // Authorize the AIOracle to mint badges
        skillTrial.setAuthorizedOracle(address(aiOracle));
        console.log("  + SkillTrial updated with AIOracle");

        // --- UserRegistry (Attestations) ---
        // 1. Authorize ProjectEscrow to add PROJECT attestations
        userRegistry.setAuthorizedCaller(address(projectEscrow), true);
        console.log("  + UserRegistry updated for ProjectEscrow");
        // 2. Authorize SkillTrial to add SKILL attestations
        userRegistry.setAuthorizedCaller(address(skillTrial), true);
        console.log("  + UserRegistry updated for SkillTrial");

        // --- ProjectEscrow (Commerce) ---
        // Authorize ProjectEscrow to create Attestations
        projectEscrow.setAuthorizedCaller(address(userRegistry), true);
        console.log("  + ProjectEscrow updated with UserRegistry");

        // --- GasSponsor ---
        // Authorize UserRegistry to receive deposits
        gasSponsor.authorizeContract(address(userRegistry), true);
        console.log("  + GasSponsor updated for UserRegistry");

        vm.stopBroadcast();
        
        // --- FIX: Replaced invalid '✅' character with '+' ---
        console.log("\n+ HumanWork Protocol V5 Deployed Successfully!");
    }
}