// Students configuration
// Add your students here with their Google Docs embed IDs
// To get the docId: Open Google Doc → File → Share → Publish to web → Embed → copy the ID from URL

export const students = [
  {
    name: 'test-student',
    slug: 'test-student',
    docId: '2PACX-1vTurOk-K2lk2x3ejMiUP6dik5eGR6bO7tnWUFFZjqCAxnNSBjNHBgzpSNTli8un1JWRTrp0gOM70Dg-'
  },
  // Add more students here:
  // {
  //   name: 'Jane Smith',
  //   slug: 'jane-smith',
  //   docId: '2PACX-1vS...'
  // },
]

// Helper function to find student by slug
export const getStudentBySlug = (slug) => {
  return students.find(student => student.slug === slug)
}
