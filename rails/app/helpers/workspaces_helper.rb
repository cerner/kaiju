module WorkspacesHelper
  def new_workspace_from_hash(project, hash)
    workspace = Kaiju::WorkspaceFactory.new_workspace(current_user.id, project.type.value)
    project.add_workspace(current_user.id, workspace)
    update_workspace_from_hash(workspace.id, hash)
  end

  def update_workspace_from_hash(id, hash)
    workspace = Kaiju::Workspace.by_id(id)
    workspace.name = hash['name'] unless hash['name'].nil?
    workspace
  end

  def rename_workspace(workspace, hash)
    workspace.name = hash['name']
  end
end
