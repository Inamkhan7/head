import { useState } from 'react';
import { useTranslation } from 'next-i18next';

type TruncateProps = {
  expandedText?: string;
  compressText?: string;
  character: number;
  children: string;
  btnClassName?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type ContentProps = {
  children: string;
  expanded: boolean;
  character: number;
};

const Content = ({ children, expanded, character }: ContentProps) => {
  if (expanded) {
    return <div dangerouslySetInnerHTML={{ __html: children }} />;
  }

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: children.substring(0, character) }}
      />
      <span>...</span>
    </>
  );
};

const Truncate: React.FC<TruncateProps> = ({
  children,
  expandedText = 'common:text-less',
  compressText = 'common:text-read-more',
  character = 150,
  btnClassName,
  onClick,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const toggleLines = () => {
    setExpanded((prev) => !prev);
  };

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (onClick) {
      return onClick(e);
    }
    toggleLines();
  }

  if (!children) return null;
  const isCharacterLimitExceeded = children.length > character;

  if (!isCharacterLimitExceeded) {
    return <>{children}</>;
  }

  return (
    <>
      <Content expanded={expanded} character={character}>
        {children}
      </Content>
      <br />
      <span>
        <button
          onClick={handleClick}
          className={`mt-1 inline-block font-bold text-accent ${
            btnClassName ? btnClassName : ''
          }`}
        >
          {t(!expanded ? compressText : expandedText)}
        </button>
      </span>
    </>
  );
};
export default Truncate;
