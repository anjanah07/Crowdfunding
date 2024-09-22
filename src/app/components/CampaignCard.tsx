import { sepolia } from "thirdweb/chains";
import { client } from "../client";
import { getContract } from "thirdweb";
import { useReadContract } from "thirdweb/react";

type CampaignCardProps = {
  campaignAddress: string;
};

const CampaignCard = ({ campaignAddress }: CampaignCardProps) => {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: campaignAddress,
  });
  const { data: campaignName } = useReadContract({
    contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: campaignDescription } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

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
  return (
    <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slate-200 rounded-lg shadow">
      {!goalIsLoading && !balanceIsLoading && (
        <div className="mb-4">
          <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-right"
              style={{ width: `${totalPercentage.toString()}` }}
            >
              <p className="text-white dark:text-white text-xs p-1 ">
                {campaignBalance?.toString()}
              </p>
            </div>
            <p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
              {totalPercentage >= 100 ? "" : `${totalPercentage.toString()}%`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignCard;
