# File Explorer Project

A React-based file explorer interface that simulates browsing, searching, renaming, and moving files and folders in a file system. The project supports dynamic folder expansion, breadcrumb navigation, search, and file operations.

## Features
#### File & Folder Tree
- Displays a hierarchical tree structure for files and folders.
- Expand/collapse folders dynamically.
- Handles both files and folders with different actions for each type.

#### Breadcrumb Navigation
- Displays the current path of the selected file or folder.
- Click on any breadcrumb to navigate directly to that folder.

#### Search Functionality
- Filter and search files and folders by name.
- Automatically expands folders that contain search results.

#### File/Folder Selection
- Select a file or folder to view its details.
- Displays properties like name, type, and full path.

#### Rename
- Rename files or folders directly in the UI.
- Validation checks to prevent empty names, whitespace-only names, and duplicate names.

#### Move
- Move files or folders to a different folder.
- Display a Move icon on selection, allowing for folder-based movement.
- A modal popup is displayed with valid destination folders for the move.
- Validates against moving into itself or its descendants.
- Updates the folder structure dynamically after the move.

#### Copy Path
- Copy the full path of any selected file or folder to the clipboard.
- The path can be pasted elsewhere for external use.

#### FullPath Handling
- Every node (file/folder) in the tree has a fullPath property for precise navigation, renaming, and moving.
- FullPath is automatically generated for each node during initialization to ensure all tree operations are based on unique paths.

## Technical Details

### Components

#### Main Home Component:
- Acts as the container for the entire file explorer interface.
- Handles state management for the file tree, breadcrumb, search, and selected item.
- Includes handlers for selecting items, renaming, searching, and moving files.

#### NodeComp (File/Folder Node Component):
- Represents each file or folder in the tree.
- Renders the name and provides options to select, rename, and move the node.
- Handles expansion and collapse of folder nodes.

#### Modal for Move Operation:
- Displays a list of valid target folders when a move operation is initiated.
- Includes validation to prevent illegal move actions (e.g., moving a folder into itself).

#### Search and Breadcrumb Components:
- Search bar filters files and folders based on user input.
- Breadcrumb navigation dynamically updates based on the current selected path, enabling easy navigation back and forth.

### Key Functionalities and Implementation Details

#### State Management:
- Utilizes React hooks (useState, useEffect) to manage application state, including selected item, expanded folders, search term, and file tree structure.

#### FullPath Generation:
- Each node in the tree is assigned a fullPath to enable accurate searches, renaming, and movement. This is done recursively during the initial setup of the file tree structure.
```const generateFullPaths = (node, parentPath = "") => {
  const fullPath = parentPath ? `${parentPath}/${node.name}` : node.name;
  const updatedNode = { ...node, fullPath };
  if (node.children) {
    updatedNode.children = node.children.map((child) => 
      generateFullPaths(child, fullPath)
    );
  }
  return updatedNode;
};
```

#### Node Selection and Breadcrumb Navigation:
- When a node is selected, the path to that node is retrieved using the findPath function, which traverses the tree and returns the full path.
The breadcrumb is updated to reflect the current node’s path, allowing users to navigate up the file structure.
```const handleSelect = (item) => {
  setSelectedItem(item);
  const path = findPath(fileTree, item.fullPath); // Finds the path based on fullPath
  setBreadcrumb(path);
  const folderNames = path.map((p) => p.name);
  setExpandedFolders(folderNames);
};
```

#### File/Folder Renaming:
- Files and folders can be renamed with validation to ensure no duplicates, empty names, or whitespace-only names.
The renameNodeInTree function recursively updates the node name in the file tree.

#### Move Operation:
- The move icon appears when a node is selected. On click, a modal shows up with valid destination folders for moving the node.
The move logic ensures that the destination is a valid folder, prevents moving into itself, and avoids circular folder structures.
The moveNode function handles the recursive movement of nodes in the tree.
```const moveNode = (tree, selected, destinationFolder) => {
 const updatedTree = removeNode(tree, selected); // Removes the selected node
  const newTree = insertNode(updatedTree, destinationFolder, selected); // Inserts into the destination folder
  return updatePaths(newTree); // Updates paths for the entire tree
};
```

### How to Run

- Clone the repository.
- Run npm install to install dependencies.
- Start the application with:
```npm run dev```
- Open the app in your browser at http://localhost:3000 to interact with the file explorer.
