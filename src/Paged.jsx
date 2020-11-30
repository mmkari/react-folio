import * as React from 'react';
import styled from 'styled-components';
import { DimensionContextProvider } from './DimensionContext';
import useContainerMeasurements from './hooks';

// defaults
const PAGE_HEIGHT_MM = 297;
const PAGE_WIDTH_MM = 210;
const FOOTER_HEIGHT_MM = 12;
const PAGE_PADDING_TOP_MM = 10;

const PagedContainer = styled.div.attrs({ className: 'PagedContainer' })`
  width: ${({ pageWidthMm }) => pageWidthMm}mm;
  position: relative;
`;

const Footer = styled.div.attrs({ className: 'Footer' })`
  position: absolute;
  top: ${({ i, pageHeightMm, footerHeightMm }) =>
    `${(i + 1) * pageHeightMm - footerHeightMm}mm`};
  height: ${({ footerHeightMm }) => footerHeightMm}mm;
  width: 100%;
  z-index: 1;
  overflow: hidden;
`;

const ContentContainer = styled.div.attrs({ className: 'ContentContainer' })`
  height: ${({ resolvedHeight }) => `${resolvedHeight}px`};
  overflow: hidden;
`;

const sortBlocks = (ds) => {
  // process blocks, sort them in order of ascending y-coordinate
  return ds.sort((a, b) => a.dims.y - b.dims.y);
};
const getRefDimensions = (refs) => {
  const dims = [];
  const bodyRect = document.body.getBoundingClientRect();
  refs.forEach((ref) => {
    // get dimensions
    if (
      ref &&
      ref.elementRef.current &&
      ref.elementRef.current.getBoundingClientRect
    ) {
      const rect = ref.elementRef.current.getBoundingClientRect();
      dims.push({
        ref,
        dims: { y: rect.top - bodyRect.top, height: rect.height },
      });
    }
  });
  return dims;
};
const getBlocks = (refs) => {
  const unsortedBlocks = getRefDimensions(refs);
  return sortBlocks(unsortedBlocks);
};

const getPageNumber = (y, pageHeight) => Math.floor(y / pageHeight);
const getPositionOnPage = (y, pageHeight) => y % pageHeight;
const getBlockOffset = (yO, pageHeight, pagePaddingTop) =>
  pageHeight - getPositionOnPage(yO, pageHeight) + pagePaddingTop;
const getDistanceToFooterStart = (y, pageHeight, footerHeight) =>
  pageHeight - getPositionOnPage(y, pageHeight) - footerHeight;
const isSamePage = (dims, pageHeight) => {
  const pageStart = getPageNumber(dims.y, pageHeight);
  const pageEnd = getPageNumber(dims.y + dims.height, pageHeight);
  return pageStart === pageEnd;
};
const isEndInFooter = (dims, pageHeight, footerHeight) => {
  const blockEndY = (dims.y + dims.height) % pageHeight;
  const footerStartY = pageHeight - footerHeight;
  return footerStartY < blockEndY;
};

const moveBlocks = (dimensions, refs, measures, pixelDensity) => {
  const { pageHeightMm, pagePaddingTopMm, footerHeightMm } = measures;
  const blocks = getBlocks(refs);

  let finalDocumentHeight;
  let numPages;
  let pageHeightPx;
  let footerHeightPx;
  let pagePaddingTopPx;
  let usePadding = false;
  if (dimensions && blocks) {
    // divide measured width with known mm-width to get px-density

    [pageHeightPx, footerHeightPx, pagePaddingTopPx] = [
      pageHeightMm,
      footerHeightMm,
      pagePaddingTopMm,
    ].map((m) => m * pixelDensity);

    let CUMULATIVE_OFFSET = 0;
    blocks.forEach((block, i) => {
      const {
        dims: { y: yOriginal, height },
        ref,
      } = block;
      const y = yOriginal + CUMULATIVE_OFFSET; // actual position after prior offsets

      if (
        !isSamePage({ y, height }, pageHeightPx) ||
        isEndInFooter({ y, height }, pageHeightPx, footerHeightPx)
      ) {
        // this component will be moved down
        // however, if previous block is a heading (No-Orphan), move that down instead
        const previousBlock = blocks[i - 1];
        let target;
        let newBlockOffset;
        if (
          previousBlock &&
          (previousBlock.ref.elementRef.current.className || '').includes(
            'No-Orphan'
          )
        ) {
          // move the previous block instead as it cannot orphaned at end of page
          target = previousBlock.ref;
          const yPrev = previousBlock.dims.y + CUMULATIVE_OFFSET;
          newBlockOffset = getBlockOffset(
            yPrev,
            pageHeightPx,
            pagePaddingTopPx
          );
          usePadding = true;
        } else if (
          (ref.elementRef.current.className || '').includes('Can-Break')
        ) {
          // this block can break
          // height of first part
          const heightFirstPart = getDistanceToFooterStart(
            y,
            pageHeightPx,
            footerHeightPx
          );
          const paddingTopSecondPart = footerHeightPx + pagePaddingTopPx;
          const heightSecondPart = height - heightFirstPart;
          const updatedLayout = {
            heightFirstPart,
            paddingTopSecondPart,
            heightSecondPart,
            originalHeight: height,
          };
          if (ref.childRef.current && ref.childRef.current.updateLayout) {
            ref.childRef.current.updateLayout(updatedLayout);
          }
          target = ref;
          newBlockOffset = paddingTopSecondPart;
        } else {
          target = ref;
          newBlockOffset = getBlockOffset(y, pageHeightPx, pagePaddingTopPx);
          usePadding = true;
        }
        CUMULATIVE_OFFSET += newBlockOffset;
        if (usePadding) {
          target.elementRef.current.style.paddingTop = `${newBlockOffset}px`;
        }
      }
    });
    const offsetHeight = dimensions.height + CUMULATIVE_OFFSET;
    numPages = Math.ceil(offsetHeight / pageHeightPx);
    finalDocumentHeight = numPages * pageHeightPx;
  }
  return [numPages, finalDocumentHeight];
};

const DefaultFooter = styled.div.attrs({ className: 'DefaultFooter' })`
  align-items: center;
  display: flex;
  justify-content: center;
  color: black;
  z-index: 2;
  height: 100%;
  width: 100%;
  background: rgba(50, 50, 50, 0.2);
`;

const defaultFooterRenderer = ({ index, numPages }) => {
  return (
    <DefaultFooter>
      &mdash; &nbsp;
      {`${index + 1} / ${numPages}`}
      &nbsp; &mdash;
    </DefaultFooter>
  );
};

const calculatePixelDensity = (pxMeasure, reference) => pxMeasure / reference;

const Paged = ({
  className,
  children,
  pageWidthMm = PAGE_WIDTH_MM,
  pageHeightMm = PAGE_HEIGHT_MM,
  pagePaddingTopMm = PAGE_PADDING_TOP_MM,
  footerHeightMm = FOOTER_HEIGHT_MM,
  footerRenderer = defaultFooterRenderer,
}) => {
  const [ref, dimensions] = useContainerMeasurements(1);
  const [refsUnsorted, setRefsUnsorted] = React.useState(null);
  const [documentResults, setDocumentResults] = React.useState(null);
  const pixelDensity = React.useMemo(() => {
    if (!dimensions) return null;
    return calculatePixelDensity(dimensions.width, pageWidthMm);
  }, [dimensions]);

  const measures = {
    pageWidthMm,
    pageHeightMm,
    pagePaddingTopMm,
    footerHeightMm,
  };

  const processBlocks = (refs) => {
    const [numPages, finalDocumentHeight] = moveBlocks(
      dimensions,
      refs,
      measures,
      pixelDensity
    );
    setDocumentResults({ numPages, finalDocumentHeight });
  };

  React.useEffect(() => {
    // dimensions are available after refs have been received and component rerenders
    let timeout;
    if (dimensions && refsUnsorted) {
      timeout = setTimeout(() => {
        processBlocks(refsUnsorted); // set timeout so components are laid out
      }, 1000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [dimensions]);

  const { numPages, finalDocumentHeight } = documentResults || {};

  return (
    <PagedContainer className={className} ref={ref} pageWidthMm={pageWidthMm}>
      <DimensionContextProvider getDims={setRefsUnsorted}>
        {numPages &&
          [...Array(numPages)].map((_, i) => {
            return (
              <Footer
                pageHeightMm={pageHeightMm}
                footerHeightMm={footerHeightMm}
                i={i}
              >
                {footerRenderer && footerRenderer({ index: i, numPages })}
              </Footer>
            );
          })}
        <ContentContainer
          resolvedHeight={finalDocumentHeight}
          pagePaddingTopMm={pagePaddingTopMm}
        >
          {children}
        </ContentContainer>
      </DimensionContextProvider>
    </PagedContainer>
  );
};

export default Paged;
