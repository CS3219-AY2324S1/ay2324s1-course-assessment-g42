/**
 * Renders the description of a question from the database. Turns lines that start with + or | to
 * Consolas for table rendering, and turns lines that start with - into <li> elements.
 * 
 * @param {String} text 
 * @returns {div}
 */
export function RenderedDescription({ text }) {
  const description = text.split(/\n\n|\n(?=-)|\n(?=[+|])/);

  const renderedParts = [];
  let bulletList = null;
  let consolasText = ''; // To collect lines starting with + or |

  description.forEach((part, index) => {
    if (part.trim().startsWith('-')) {
      // If it starts with a bullet point indicator, create a new <ul>
      if (!bulletList) {
        bulletList = <ul key={`bullet-${index}`} children={[]} />;
        renderedParts.push(bulletList);
      }

      // Add the bullet point as an <li>
      bulletList.props.children.push(<li key={`bullet-${index}`}>{part.trim().substring(1)}</li>);
    } else if (part.trim().match(/^[+|]/)) {
      // If it starts with + or |, add it to the consolasText
      consolasText += part + '\n';
    } else {
      // If the part doesn't start with '-', '+', or '|', render it as a regular text paragraph
      if (bulletList) {
        // Close the previous <ul> if we were in a bullet point section
        bulletList = null;
      }
      if (consolasText) {
        // If there's consolas text collected, render it together with the white-space: pre CSS property
        renderedParts.push(
          <p
            key={`consolas-${index}`}
            style={{
              fontFamily: 'Consolas, monospace',
              whiteSpace: 'pre',
            }}
          >
            {consolasText.trim()}
          </p>
        );
        consolasText = ''; // Reset consolasText
      }
      renderedParts.push(<p key={`regular-${index}`}>{part}</p>);
    }
  });

  // Check if there's remaining consolasText to render
  if (consolasText) {
    renderedParts.push(
      <p
        key={`consolas-${description.length}`}
        style={{
          fontFamily: 'Consolas, monospace',
          whiteSpace: 'pre',
        }}
      >
        {consolasText.trim()}
      </p>
    );
  }

  return <div>{renderedParts}</div>;
}

export function DifficultyText({ difficulty }) {
  const difficultyClass = {
    'Easy': 'green-text',
    'Medium': 'orange-text',
    'Hard': 'red-text',
  };

  return (
    <span className={`difficulty-text ${difficultyClass[difficulty]}`}>
      <b>{difficulty}</b>
    </span>
  );
}