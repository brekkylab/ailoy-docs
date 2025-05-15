import Tabs, { type Props as TabsProps } from "@theme/Tabs";

function CodeTabs(props: TabsProps) {
  return <Tabs groupId="code-language" {...props} />;
}

export const pythonTab = { value: "python", label: "Python" };
export const nodeTab = { value: "node", label: "JavaScript (Node)" };

export default CodeTabs;
