const subjectData = [
  {
    id: 1,
    name: "Category A",
    parentId: null,
    children: [
      {
        id: 2,
        name: "Subcategory A1",
        parentId: 1,
        children: [],
        videos: [
          {
            videoId: 101,
            userVideoName: "Introduction to A1",
          },
          {
            videoId: 102,
            userVideoName: "Advanced A1",
          },
        ],
      },
    ],
    videos: [
      {
        videoId: 100,
        userVideoName: "Overview of A",
      },
    ],
  },
  {
    id: 3,
    name: "Category B",
    parentId: null,
    children: [],
    videos: [],
  },
];

export default subjectData;
