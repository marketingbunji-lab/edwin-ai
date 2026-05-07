type Item = {
  title: string;
  content: string;
};

type Props = {
  items: Item[];
  id?: string;
};

export default function LandingAccordion({
  items,
  id = "landing-accordion",
}: Props) {
  return (
    <div className="uam-accordion">
      {items.map((item, index) => {
        const inputId = `${id}-item-${index}`;

        return (
          <div key={index} className="uam-accordion-item">
            <input
              className="uam-accordion-input"
              type="radio"
              name={id}
              id={inputId}
              defaultChecked={index === 0}
            />
            <label className="uam-accordion-summary" htmlFor={inputId}>
              <span>{item.title}</span>
              <span className="uam-accordion-icons" aria-hidden="true">
                <span className="uam-accordion-plus">+</span>
                <span className="uam-accordion-minus">-</span>
              </span>
            </label>
            <div className="uam-accordion-panel">{item.content}</div>
          </div>
        );
      })}
    </div>
  );
}
