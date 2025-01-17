import { useState } from 'react';
import cn from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import { MinusIcon } from '@/core/atoms/icons/minus-icon';
import { PlusIcon } from '@/core/atoms/icons/plus-icon';
import { heightCollapse } from '@/lib/motion/height-collapse';

type CollapseProps = {
  i: number;
  title: string | JSX.Element;
  content: string | JSX.Element;
  expanded: number;
  setExpanded: any;
};

const Collapse: React.FC<CollapseProps> = ({
  i,
  expanded,
  setExpanded,
  title,
  content,
}) => {
  const isOpen = i === expanded;
  const activeClass = isOpen ? 'shadow-sm' : '';

  return (
    <div
      className={cn(
        'mb-2.5 rounded border border-solid border-border-200 bg-light transition-all hover:border-border-base',
        activeClass
      )}
    >
      <motion.header
        initial={false}
        onClick={() => setExpanded(isOpen ? false : i)}
        className="flex cursor-pointer items-center justify-between rounded py-4 px-5 transition-colors"
      >
        <h2 className="text-sm font-semibold leading-relaxed text-heading md:text-base">
          {title}
        </h2>
        {isOpen ? (
          <MinusIcon
            className="flex-shrink-0 stroke-2"
            width={18}
            height={18}
          />
        ) : (
          <PlusIcon className="flex-shrink-0 stroke-2" width={20} height={20} />
        )}
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="from"
            animate="to"
            exit="from"
            variants={heightCollapse()}
          >
            <div className="px-5 pb-4 text-sm leading-7 text-body-dark md:pt-1 md:text-base md:leading-loose">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type AccordionProps = {
  items: {
    id: string;
    title: string | JSX.Element;
    content: string | JSX.Element;
  }[];
};

const Accordion: React.FC<AccordionProps> = ({ items }) => {
  const [expanded, setExpanded] = useState<number>(0);
  return (
    <>
      {items.map(({ title, content, id }, index) => (
        <Collapse
          i={index}
          key={id}
          title={title}
          content={content}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      ))}
    </>
  );
};

export default Accordion;
