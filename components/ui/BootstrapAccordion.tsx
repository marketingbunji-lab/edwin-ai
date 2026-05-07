type Item = {
  title: string;
  content: string;
};

type Props = {
  items: Item[];
  id?: string;
};

export default function BootstrapAccordion({
  items,
  id = "accordionExport",
}: Props) {
  return (
    <div className="accordion" id={id}>
      {items.map((item, index) => {
        const headingId = `${id}-heading-${index}`;
        const collapseId = `${id}-collapse-${index}`;
        const isFirst = index === 0;

        return (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={headingId}>
              <button
                className={`accordion-button ${isFirst ? "" : "collapsed"}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${collapseId}`}
                aria-expanded={isFirst ? "true" : "false"}
                aria-controls={collapseId}
              >
                {item.title}
              </button>
            </h2>

            <div
              id={collapseId}
              className={`accordion-collapse collapse ${isFirst ? "show" : ""}`}
              aria-labelledby={headingId}
              data-bs-parent={`#${id}`}
            >
              <div className="accordion-body">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}