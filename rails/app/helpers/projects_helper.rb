module ProjectsHelper
  def new_project_from_hash(hash)
    # default type to terra for now
    type = hash['type'] || 'terra'
    project = Kaiju::ProjectFactory.new_project(current_user.id, type)
    update_project_from_hash(project.id, hash)
  end

  def update_project_from_hash(id, hash)
    project = Kaiju::Project.by_id(id)
    project.name = hash['name'] unless hash['name'].nil?
    add_default_workspace(project)
    project
  end

  def add_default_workspace(project)
    user_id = current_user.id
    workspace = Kaiju::WorkspaceFactory.new_workspace(user_id)
    project.add_workspace(user_id, workspace)
  end

  def rename_project(project, hash)
    project.name = hash['name']
  end

  def update_changelog_viewed_flag(user, _project, hash)
    user.changelog_viewed = hash['changelog_viewed']
  end
end
