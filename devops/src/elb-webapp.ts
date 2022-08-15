import {
  getWebappLoadBalancerName,
  webappLoadBalancerType,
} from "@ggbot2/infrastructure";
import { LoadBalancerStatus, getLoadBalancerStatus } from "./_elb.js";

const webappLoadBalancerName = getWebappLoadBalancerName();

export const getWebappLoadBalancerStatus =
  async (): Promise<LoadBalancerStatus> =>
    await getLoadBalancerStatus(
      { Names: [webappLoadBalancerName] },
      { wantedType: webappLoadBalancerType }
    );
