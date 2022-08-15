import {
  getWorkerLoadBalancerName,
  workerLoadBalancerType,
} from "@ggbot2/infrastructure";
import { LoadBalancerStatus, getLoadBalancerStatus } from "./_elb.js";

const workerLoadBalancerName = getWorkerLoadBalancerName();

export const getWorkerLoadBalancerStatus =
  async (): Promise<LoadBalancerStatus> =>
    await getLoadBalancerStatus(
      { Names: [workerLoadBalancerName] },
      { wantedType: workerLoadBalancerType }
    );
