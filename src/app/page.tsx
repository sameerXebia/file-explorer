'use client'

import React, { useEffect, useState } from 'react'
import NodeComp from '@/components/Node'
import fileDataMock from '@/data/fileData'
import MoveModal from '@/components/MoveModal'

export default function Home() {
	const [selectedItem, setSelectedItem] = useState<any>(null)
	const [expandedFolders, setExpandedFolders] = useState<any>([])
	const [renameData, setRenameData] = useState<any>({ newName: '', error: '' })
	const [search, setSearch] = useState('')
	const [fileTree, setFileTree] = useState(fileDataMock)
	const [filteredTree, setFilteredTree] = useState(fileDataMock)
	const [breadcrumb, setBreadcrumb] = useState([])
	const [copyMessage, setCopyMessage] = useState('')
	const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)

	useEffect(() => {
		const treeWithPaths = generateFullPaths(fileDataMock)
		setFileTree(treeWithPaths)
		setFilteredTree(treeWithPaths)
		expandAllFolders(fileDataMock)
	}, [fileDataMock])

	const generateFullPaths = (node: any, parentPath = '') => {
		const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name
		const updatedNode = {
			...node,
			fullPath
		}
		if (node.children) {
			updatedNode.children = node.children.map((child: any) => generateFullPaths(child, fullPath))
		}
		return updatedNode
	}

	const toggleExpand = (folderName: string) => {
		setExpandedFolders((prev: any) => (prev.includes(folderName) ? prev.filter((name: string) => name !== folderName) : [...prev, folderName]))
	}

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

	const handleSelect = (item: any) => {
		setSelectedItem(item)
		const path = findPath(fileTree, item.fullPath)
		setBreadcrumb(path)
	}

	const expandAllFolders = (node: any) => {
		if (node.type === 'folder') {
			setExpandedFolders((prev: any) => [...prev, node.name])
			node.children?.forEach((child: any) => expandAllFolders(child))
		}
	}

	const validateNewName = (newName: string) => {
		if (!newName.trim()) return false
		if (isDuplicateName(newName)) return false
		return true
	}

	const isDuplicateName = (newName: string) => {
		const parent = findParent(fileDataMock, selectedItem)
		if (!parent) return false
		return parent.children.some((sibling: any) => sibling.name.toLowerCase() === newName.trim().toLowerCase())
	}

	const findParent = (node: any, child: any) => {
		if (!node.children) return null
		for (let childNode of node.children) {
			if (childNode === child) {
				return node
			}
			const foundParent: any = findParent(childNode, child)
			if (foundParent) return foundParent
		}
		return null
	}

	const updateNodeName = (newName: string) => {
		if (!selectedItem) return

		const updated = renameNodeInTree(fileTree, selectedItem.fullPath, newName)
		setFileTree(updated)
		setFilteredTree(updated)
		const newSelectedPath = selectedItem.fullPath.split('/').slice(0, -1).concat(newName).join('/')
		const newSelected = findPath(updated, newSelectedPath).at(-1)
		setSelectedItem(newSelected)
		const bc = findPath(updated, newSelected.fullPath)
		setBreadcrumb(bc)
	}

	const renameNodeInTree = (node: any, targetNode: any, newName: string) => {
		if (node === targetNode) {
			return { ...node, name: newName }
		}
		if (node.children) {
			return {
				...node,
				children: node.children.map((child: any) => renameNodeInTree(child, targetNode, newName))
			}
		}

		return node
	}

	const filterTree = (node: any, term: any) => {
		const lowerTerm = term.toLowerCase()
		const nameMatches = node.name.toLowerCase().includes(lowerTerm)
		if (node.type === 'folder') {
			const filteredChildren = node.children.map((ch) => filterTree(ch, term)).filter(Boolean)
			if (nameMatches || filteredChildren.length > 0) {
				return {
					...node,
					children: filteredChildren
				}
			}
			return null
		}
		return nameMatches ? node : null
	}

	const handleRename = (newName: string) => {
		const isValid = validateNewName(newName)
		if (isValid) {
			updateNodeName(newName)
			setRenameData({ newName: '', error: '' })
		} else {
			setRenameData((prev: any) => ({
				...prev,
				error: 'Invalid name: name cannot be empty, whitespace, or duplicate.'
			}))
		}
	}

	const handleSearch = (value: string) => {
		setSearch(value)
		if (!value.trim()) {
			setFilteredTree(fileDataMock)
			expandAllFolders(fileDataMock)
			return
		}
		const result = filterTree(fileDataMock, value)
		setFilteredTree(result || { name: 'empty', type: 'folder', children: [] })
		setExpandedFolders([])
		expandAllFolders(result)
	}

	const handleBreadcrumbClick = (item: any) => {
		setSelectedItem(item)
		const path = findPath(fileTree, item.fullPath)
		setBreadcrumb(path)
		const folderNames = path.map((p: any) => p.name)
		setExpandedFolders(folderNames)
	}

	const copyFullPath = () => {
		navigator.clipboard.writeText(selectedItem?.fullPath)
		setCopyMessage('Path copied!')
		setTimeout(() => setCopyMessage(''), 2000)
	}

	const moveNode = (tree: any, selected: any, destinationFolder: string) => {
		const removeNode = (node: any) => {
			if (!node.children) return node
			return {
				...node,
				children: node.children.filter((child) => child.fullPath !== selected.fullPath).map(removeNode)
			}
		}

		const treeWithoutSelected = removeNode(tree)

		const insertNode = (node: any) => {
			if (node.fullPath === destinationFolder.fullPath) {
				return {
					...node,
					children: [...(node.children || []), selected]
				}
			}

			if (!node.children) return node

			return {
				...node,
				children: node.children.map(insertNode)
			}
		}

		const treeWithInserted = insertNode(treeWithoutSelected)

		const updatePaths = (node: any, parentPath = '') => {
			const newFullPath = parentPath ? `${parentPath}/${node.name}` : node.name

			const updated = { ...node, fullPath: newFullPath }

			if (node.children) {
				updated.children = node.children.map((child) => updatePaths(child, newFullPath))
			}

			return updated
		}

		return updatePaths(treeWithInserted)
	}

	const handleMove = (destinationFolder: any) => {
		const updatedTree = moveNode(fileTree, selectedItem, destinationFolder)
		setFileTree(updatedTree)
		setFilteredTree(updatedTree)
		setIsMoveModalOpen(false)

		const newSelected = findPath(updatedTree, selectedItem.fullPath)?.at(-1)
		if (newSelected) setSelectedItem(newSelected)
		setBreadcrumb(findPath(updatedTree, newSelected.fullPath))
	}

	const showMoveModalFn = (modal: any) => {
		setIsMoveModalOpen(modal)
	}

	return (
		<main>
			<div style={{ display: 'flex', height: '100vh' }}>
				<div style={{ width: 300, borderRight: '1px solid #ffffff40', height: '100vh' }}>
					<input type='text' value={search} onChange={(e) => handleSearch(e.target.value)} placeholder='Search files...' style={{ width: '98%', padding: 6, marginTop: 4, marginLeft: 2, marginRight: 4, marginBottom: 8 }} />
					{breadcrumb?.length > 0 && (
						<div style={{ marginBottom: 12, fontSize: 14 }}>
							{breadcrumb.map((item: any, index: number) => (
								<span key={item?.name}>
									<span
										style={{
											cursor: 'pointer',
											color: index === breadcrumb.length - 1 ? 'black' : 'white',
											fontWeight: index === breadcrumb.length - 1 ? 'bold' : 'normal'
										}}
										onClick={() => handleBreadcrumbClick(item)}>
										{item?.name}
									</span>

									{index < breadcrumb.length - 1 && <span style={{ margin: '0 6px' }}>/</span>}
								</span>
							))}
						</div>
					)}
					<NodeComp onMove={showMoveModalFn} onCopy={copyFullPath} node={filteredTree} onSelect={handleSelect} selectedItem={selectedItem} expandedFolders={expandedFolders} toggleExpand={toggleExpand} renameData={renameData} onRename={handleRename} />
				</div>

				<div style={{ flex: 1, padding: 16 }}>
					<h3 style={{ marginBottom: 8 }}>Details</h3>
					{selectedItem ? (
						<>
							<div style={{ marginBottom: 4 }}>{`Name:${selectedItem?.name}`}</div>
							<div style={{ marginBottom: 4 }}>{`Type: ${selectedItem?.type}`}</div>
							<div style={{ marginBottom: 4 }}>{`Path: ${selectedItem?.fullPath}`}</div>
							<button
								onClick={copyFullPath}
								style={{
									marginTop: 10,
									padding: '6px 12px',
									cursor: 'pointer',
									background: '#007bff',
									color: 'white',
									border: 'none',
									borderRadius: 4
								}}>
								Copy Path
							</button>
							{copyMessage && <div style={{ marginTop: 8, color: 'green' }}>{copyMessage}</div>}
						</>
					) : (
						<div>Select a file or folder to see details.</div>
					)}
				</div>
				{isMoveModalOpen && <MoveModal selectedItem={selectedItem} handleMove={handleMove} fileTree={fileTree} setShowMoveModal={showMoveModalFn} />}
			</div>
		</main>
	)
}
