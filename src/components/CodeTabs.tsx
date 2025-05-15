// src/components/CodeTabs.tsx
import React, { ReactElement } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

type CodeTabProps = {
  children: string;
};

type CodeTabComponent = React.FC<CodeTabProps> & {
  displayName: string;
  language: string;
};

function CodeTabs({ children }: { children: React.ReactNode }) {
  const elements = React.Children.toArray(children)
    .filter(React.isValidElement)
    .filter(
      (el): el is ReactElement<CodeTabProps> =>
        typeof el.type === 'function' && 'language' in el.type
    );

  return (
    <Tabs groupId="code-language">
      {elements.map((child, index) => {
        const type = child.type as CodeTabComponent;
        const label = type.displayName ?? `Tab ${index + 1}`;
        const language = type.language ?? 'plaintext';
        const content = child.props.children;

        return (
          <TabItem key={label} value={label} label={label}>
            <CodeBlock language={language}>{content}</CodeBlock>
          </TabItem>
        );
      })}
    </Tabs>
  );
}

// Factory to create tab subcomponents with metadata
function createCodeTab(label: string, language: string): CodeTabComponent {
  const Component: CodeTabComponent = ({ children }) => <>{children}</>;
  Component.displayName = label;
  Component.language = language;
  return Component;
}

// Attach pre-defined tab types
CodeTabs.Python = createCodeTab('Python', 'python');
CodeTabs.Nodejs = createCodeTab('Javascript(Node)', 'javascript');

export default CodeTabs;
