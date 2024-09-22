import { client } from "@/app/client";
import { useParams } from "next/navigation";
import React from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

const ContractAddress = () => {
  const { campaignAddress } = useParams();
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: campaignAddress as string,
  });

  const { data: campaignName, isLoading: isNameLoading } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  const { data: campaignDeadline, isPending } = useReadContract({
    contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const dealineDate = new Date(
    parseInt(campaignDeadline?.toString() as string)
  );
  const deadlineDatePassed = dealineDate < new Date();
  const { data: campaignGoal, isLoading: goalIsLoading } = useReadContract({
    contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  const { data: campaignBalance, isLoading: balanceIsLoading } =
    useReadContract({
      contract,
      method: "function getContractBalance() view returns (uint256)",
      params: [],
    });

  const totalGoal = campaignGoal?.toString();
  const totalBalance = campaignBalance?.toString();

  let totalPercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  if (totalPercentage >= 100) {
    totalPercentage = 100;
  }
  const { data: tiers, isPending: isTiersLoading } = useReadContract({
    contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });
  const { data: owner, isPending: isOwnerLoading } = useReadContract({
    contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: state, isPending: isStateLoading } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });
  return (
    <div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center">
        {!isNameLoading && (
          <p className="text-4xl font-semibold">{campaignName}</p>
        )}
      </div>
    </div>
  );
};

export default ContractAddress;
