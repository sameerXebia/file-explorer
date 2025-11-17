const fileDataMock = {
	name: 'root',
	type: 'folder',
	children: [
		{
			name: 'Documents',
			type: 'folder',
			children: [
				{
					name: 'Resume.pdf',
					type: 'file'
				},
				{
					name: 'CoverLetter.docx',
					type: 'file'
				}
			]
		},
		{
			name: 'Images',
			type: 'folder',
			children: [{
        name: '.png',
        type: 'folder',
        children: [{
					name: 'Vacation.png',
					type: 'file'
				},
				{
					name: 'Profile.png',
					type: 'file'
				}]
      }, {
        name: '.jpg',
        type: 'folder',
        children: [{
					name: 'Vacation.jpg',
					type: 'file'
				},
				{
					name: 'Profile.jpg',
					type: 'file'
				}]
      }, {
        name: '.svg',
        type: 'folder',
        children: [{
					name: 'Vacation.svg',
					type: 'file'
				},
				{
					name: 'Profile.svg',
					type: 'file'
				}]
      }]
		},
		{
			name: 'README.txt',
			type: 'file'
		}
	]
}

export default fileDataMock