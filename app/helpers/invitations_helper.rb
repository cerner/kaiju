module InvitationsHelper
  def accept_invitation(invitation)
    workspace_id = invitation.workspace_id.value
    project_id = invitation.project_id.value
    inviter = invitation.inviter_id.value
    if workspace_id
      accept_workspace_invitation(project_id, workspace_id, inviter)
    else
      accept_project_invitation(project_id, inviter)
    end
  end

  def accept_workspace_invitation(project_id, workspace_id, inviter)
    Kaiju::Workspace.by_id(workspace_id)&.add_collaborators(inviter, [current_user.id])
    request.base_url + Rails.application.routes.url_helpers.project_workspace_path(project_id, workspace_id)
  end

  def accept_project_invitation(project_id, inviter)
    Kaiju::Project.by_id(project_id)&.add_collaborators(inviter, [current_user.id])
    request.base_url + Rails.application.routes.url_helpers.project_path(project_id)
  end
end
