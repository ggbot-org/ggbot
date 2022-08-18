import {
  DescribeLoadBalancersArgs,
  ElasticLoadBalancingV2ServiceException,
  LoadBalancer,
  LoadBalancerTypeEnum,
  describeLoadBalancers,
} from "@ggbot2/aws";

export type LoadBalancerStatus = { exists: boolean } & Partial<
  Pick<LoadBalancer, "Type"> & {
    typeIsOk?: boolean;
  }
>;

type GetLoadBalancerStatusOptions = {
  wantedType: LoadBalancerTypeEnum;
};

export const getLoadBalancerStatus = async (
  args: DescribeLoadBalancersArgs,
  options: GetLoadBalancerStatusOptions
): Promise<LoadBalancerStatus> => {
  try {
    const result = await describeLoadBalancers(args);
    const exists = result.LoadBalancers?.length === 1;
    if (!exists) return { exists };
    const { Type } = result.LoadBalancers?.[0] as LoadBalancer;
    return {
      exists: true,
      Type,
      typeIsOk: options.wantedType === Type,
    };
  } catch (error) {
    if (error instanceof ElasticLoadBalancingV2ServiceException)
      if (error.name === "LoadBalancerNotFound") return { exists: false };
    throw error;
  }
};
