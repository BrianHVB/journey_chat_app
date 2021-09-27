import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'

export function AutoScroller({ children, className = '', alwaysScroll = false, tolerance = 25 }) {
  const containerRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  const autoScrolling = useRef(false);

  function updateAutoScrollCondition(element, tolerance) {
    const { scrollHeight, scrollTop, clientHeight } = element;
    shouldAutoScroll.current = scrollHeight - scrollTop <= clientHeight + tolerance;
  }

  function onContainerScroll(e) {
    if (alwaysScroll || autoScrolling.current) {
      return;
    }

    updateAutoScrollCondition(e.target, tolerance);
  }

  /** @namespace element.scrollHeight **/
  useEffect(function autoScroll() {
    if (shouldAutoScroll.current) {
      autoScrolling.current = true;
      const element = containerRef.current;
      element.scrollTop = element.scrollHeight;
      autoScrolling.current = false;
    }
  });

  return (
    <Scroller ref={containerRef} onScroll={onContainerScroll}>
      {children}
    </Scroller>
  );
}

AutoScroller.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  alwaysScroll: PropTypes.bool,
  tolerance: PropTypes.number,
};

const Scroller = styled.div`
  overflow: auto;
  width: 100%;
  height: 100%;
`
