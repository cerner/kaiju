require 'component_information'

class ProjectsController < ApplicationController
  include ::ProjectsHelper
  before_action(except: %i[index create new]) { fetch_project(params[:id]) }
  before_action(except: %i[show index create new reference_components]) { authorize(params[:project_object].editors) }

  # GET /projects/1
  def show # rubocop:disable Metrics/AbcSize
    Rails.logger.debug params

    @project = Kaiju::ProjectJson.as_json(params[:id], request.base_url, user_id: current_user.id)
    @user = Kaiju::UserJson.as_json(current_user.id, request.base_url)

    respond_to do |format|
      format.html
      format.json { render json: JSON.pretty_generate(@project) }
    end
  end

  # GET /projects
  def index
    Rails.logger.debug params

    user = Kaiju::User.by_id(params[:user_id])

    render json: Kaiju::ProjectJson.projects_to_json(user, request.base_url)
  end

  # POST /projects
  # {
  #   "transient": true,
  #   "name": "Untitled Project",
  #   "default_workspace": {
  #     "name":"Untitled Workspace"
  #   }
  # }
  def create
    Rails.logger.debug params

    # binding.pry

    data = params.fetch(:project, {})

    project = new_project_from_hash(data)

    render status: 201, json: Kaiju::ProjectJson.as_json(project.id, request.base_url, user_id: current_user.id)
  end

  # DELETE /projects/1
  def destroy
    Rails.logger.debug params

    params[:project_object].inactivate

    head :ok
  end

  def activate
    params[:project_object].activate
    head :ok
  end

  def changelog_viewed
    update_changelog_viewed_flag(current_user, params[:project_object], params)
    head :ok
  end

  def name
    Rails.logger.debug params

    rename_project(params[:project_object], params)

    head :ok
  end

  def reference_components
    render json: JSON.pretty_generate(ComponentInformation.sorted_components(params[:project_object].type.value))
  end

  # GET /projects/1/collaboration_invitation
  def collaboration_invitation
    invtation = Kaiju::InvitationFactory.new_project_invitation(params[:id], current_user.id)
    render json: Kaiju::InvitationJson.to_json(invtation.id, request.base_url)
  end

  # TODO: Adding temporary path for creating a new project
  def new
    redirect_to project_path id: new_project_from_hash('transient' => true,
                                                       'name' => 'Untitled Project',
                                                       'default_workspace' => {
                                                         'name' => 'Untitled Workspace'
                                                       }).id
  end
end
