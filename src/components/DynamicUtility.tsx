import dynamic from "next/dynamic";

const DynamicUtilityComponent = dynamic(() => import("./AccessPage"), {
  ssr: false,
});

export default DynamicUtilityComponent;
