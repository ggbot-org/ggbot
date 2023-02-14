import { useRouter } from "next/router";
import { useCallback } from "react";

/**
 * @example
 * ```ts
 * import { useGoBack } from "_hooks";
 *
 * const Component = () => {
 *   const goBack = useGoBack();
 *   return <Button onClick={goBack}>Go back</Button>;
 * }
 * ```
 */
export const useGoBack = () => {
  const router = useRouter();
  return useCallback(() => {
    router.back();
  }, [router]);
};
