import {
  DescribeLoadBalancersArgs,
  ElasticLoadBalancingV2ServiceException,
  LoadBalancer,
  LoadBalancerTypeEnum,
  describeLoadBalancers,
} from "@ggbot2/aws";

export type LoadBalancerStatus = LoadBalancer & {
  exists: boolean;
  typeIsOk?: boolean;
};

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
    const loadBalancer = result.LoadBalancers?.[0] as LoadBalancer;
    return {
      exists: true,
      typeIsOk: options.wantedType === loadBalancer.Type,
      ...loadBalancer,
    };
  } catch (error) {
    if (error instanceof ElasticLoadBalancingV2ServiceException)
      if (error.name === "LoadBalancerNotFound") return { exists: false };
    throw error;
  }
};
