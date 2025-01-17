const FAQ_GRAPHQL_FIELDS = `
question
answer
`

async function fetchGraphQL(query:any, preview = false) {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
          }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json())
}

//Validate Data
function extractfaqEntries(fetchResponse :any) {
  return fetchResponse?.data?.faqItemCollection?.items.map(
    ( obj: { question: any; answer: any; }) => {
      return {
        "title": obj.question,
        "content": obj.answer,
      }
    }
  );
}


//Fetch Data
export async function getAllfaqEnabled() {
  const entries = await fetchGraphQL(
    `query {
      faqItemCollection(where: { disabled: false }) {
        items {
          ${FAQ_GRAPHQL_FIELDS}
        }
      }
    }`
  )
  return extractfaqEntries(entries)
}