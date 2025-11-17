import { useState } from 'react'

interface MoveModalProps {
	selectedItem: any
	handleMove: (path: string) => void
	fileTree: any
	setShowMoveModal: (show: boolean) => void
}

const MoveModal = ({ selectedItem, handleMove, fileTree, setShowMoveModal }: MoveModalProps) => {
	const [destinationPath, setDestinationPath] = useState('')
	const [moveError, setMoveError] = useState('')

  // const isDescendant = (selected, target) => {
	// 	return target.fullPath.startsWith(selected.fullPath)
	// }

	const findPath = (node: any, targetFullPath: any, path = []) => {
		if (!node) return null
		const newPath: any = [...path, node]
		if (node.fullPath === targetFullPath) {
			return newPath
		}
		if (node.children) {
			for (const child of node.children) {
				const result: any = findPath(child, targetFullPath, newPath)
				if (result) return result
			}
		}
		return null
	}

	const collectAllFolders = (node: any, list: any = []) => {
		if (node?.type === 'folder') {
			list.push({
				name: node.name,
				fullPath: node.fullPath
			})

			if (Array.isArray(node.children)) {
				node.children.forEach((child: any) => collectAllFolders(child, list))
			}
		}
		return list
	}

	const getValidMoveTargets = (tree: any, selected: any) => {
		const allFolders = collectAllFolders(tree)
		return allFolders.filter((folder: any) => {
			if (folder.fullPath === selected.fullPath) return false
			if (folder.fullPath.startsWith(selected.fullPath + '/')) return false

			return true
		})
	}

	const moveHandler = (destinationFullPath: string) => {
		setMoveError('')

		if (!selectedItem) {
			setMoveError('Nothing selected to move.')
			return
		}

    if (!destinationFullPath) {
      setMoveError('Select a destination.')
			return
    }

		const destinationFolder = findPath(fileTree, destinationFullPath)?.at(-1)

		if (!destinationFolder || destinationFolder.type !== 'folder') {
			setMoveError('Destination must be a folder.')
			return
		}

		if (destinationFolder.fullPath === selectedItem.fullPath) {
			setMoveError('Cannot move a folder into itself.')
			return
		}

		if (destinationFolder.fullPath.startsWith(selectedItem.fullPath + '/')) {
			setMoveError('Cannot move into a descendant folder.')
			return
		}

		handleMove(destinationFolder)
    if (!moveError) {
      setShowMoveModal(false)
      setDestinationPath('')
    }
	}

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100vw',
				height: '100vh',
				background: 'rgba(0,0,0,0.6)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 9999
			}}>
			<div
				style={{
					background: 'white',
					padding: 20,
					borderRadius: 8,
					width: 350
				}}>
				<h3 style={{ color: 'black' }}>Move "{selectedItem?.name}" to: </h3>
				<select
					style={{ width: '100%', padding: 8, marginTop: 6, outline: 'none' }}
					value={destinationPath}
					onChange={(e) => {
            setMoveError('')
						setDestinationPath(e.target.value)
					}}>
					<option value=''>Select folder…</option>
					{getValidMoveTargets(fileTree, selectedItem)
						.filter((f: any) => f.fullPath !== selectedItem?.fullPath)
						.map((folder: any) => (
							<option key={folder.fullPath} value={folder.fullPath}>
								{folder.fullPath}
							</option>
						))}
				</select>

				{moveError && <div style={{ color: 'red', marginTop: 8 }}>{moveError}</div>}

				<div
					style={{
						marginTop: 20,
						display: 'flex',
						justifyContent: 'flex-end',
						gap: 10
					}}>
					<button
						onClick={() => setShowMoveModal(false)}
						style={{
							padding: '6px 12px',
							cursor: 'pointer',
							background: '#aaa',
							border: 'none',
							borderRadius: 4
						}}>
						Cancel
					</button>

					<button
						onClick={() => {
							moveHandler(destinationPath)
						}}
						style={{
							padding: '6px 12px',
							cursor: 'pointer',
							background: '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: 4
						}}>
						Move
					</button>
				</div>
			</div>
		</div>
	)
}

export default MoveModal
