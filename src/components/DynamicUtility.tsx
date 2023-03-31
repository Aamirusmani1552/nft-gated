import dynamic from "next/dynamic";

const DynamicUtilityComponent = dynamic(() => import("./AccessModal"), {
  ssr: false,
});

export default DynamicUtilityComponent;
