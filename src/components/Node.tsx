import { useEffect, useState } from 'react'
import { FiFolder, FiFile, FiEdit, FiMove } from 'react-icons/fi'

interface NodeCompProps {
	node: any
	onSelect: (node: any) => void
	selectedItem: any
	expandedFolders: string[]
	toggleExpand: (folderName: string) => void
  renameData: any
  onRename: (n: string) => void
  onCopy: (fPath: string) => void
	onMove: (n: any) => void
}

const NodeComp = ({ node, onSelect, selectedItem, expandedFolders, toggleExpand, onRename, renameData, onCopy, onMove }: NodeCompProps) => {
	const { name, type, children } = node
	const isFolder = type === 'folder'

	const [selected, setSelected] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [tempName, setTempName] = useState(name)

	useEffect(() => {
		if (selectedItem && selectedItem?.name === node?.name) {
			setSelected(true)
		} else {
			setSelected(false)
		}
	}, [selectedItem, node.name])

	const handleToggle = () => {
		toggleExpand(name)
	}

	const handleRenameChange = (e: any) => {
		setTempName(e.target.value)
	}

	const handleRenameSubmit = () => {
		if (tempName !== name) {
			setIsEditing(false)
			onRename(tempName)
		}
	}

	return (
		<div style={{ paddingLeft: 20 }}>
			<div
				onClick={() => onSelect(node)}
				style={{
					display: 'flex',
					alignItems: 'center',
					cursor: 'pointer',
					backgroundColor: selected ? '#e0e0e030' : 'transparent',
					padding: '5px',
					borderRadius: '4px',
					position: 'relative'
				}}>
				{isFolder && (
					<span onClick={handleToggle} style={{ marginRight: 8 }}>
						{expandedFolders.includes(name) ? '-' : '+'}
					</span>
				)}
				{isFolder ? <FiFolder /> : <FiFile />}
				<span style={{ marginLeft: 8 }}>{isEditing ? <input type='text' value={tempName} onChange={handleRenameChange} onBlur={handleRenameSubmit} onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()} autoFocus style={{ padding: '2px 4px' }} /> : name}</span>
				{selectedItem?.name === name && !isEditing && (
					<span
						style={{
							position: 'absolute',
							right: 10,
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center'
						}}>
						<FiEdit size={16} onClick={() => setIsEditing(true)} />
						<FiMove size={16} style={{ marginLeft: 8 }} onClick={() => onMove(node)} />
					</span>
				)}
			</div>

			{renameData?.error && selectedItem?.name === name && <div style={{ color: 'red', marginTop: '5px' }}>{renameData.error}</div>}

			{isFolder && expandedFolders.includes(name) && children && (
				<div>
					{children
						.sort((a: any, b: any) => a.name.localeCompare(b.name))
						.map((child: any) => (
							<NodeComp key={child.name} node={child} onSelect={onSelect} selectedItem={selectedItem} expandedFolders={expandedFolders} toggleExpand={toggleExpand} renameData={renameData} onRename={onRename} onCopy={onCopy} onMove={onMove} />
						))}
				</div>
			)}
		</div>
	)
}

export default NodeComp
