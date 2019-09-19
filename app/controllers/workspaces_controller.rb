require 'rouge'

class WorkspacesController < ApplicationController
  include ::WorkspacesHelper
  include ::ComponentsHelper
  before_action(except: %i[index create]) { fetch_workspace(params[:id]) }
  before_action(except: %i[destroy]) { fetch_project(params[:project_id]) }
  before_action(only: %i[show]) { current_user.add_recent_workspace(params[:project_id], params[:id]) }
  before_action(except: %i[show index code attributes preview ast create]) do
    authorize(params[:workspace_object].editors)
  end
  before_action(only: %i[create]) { authorize(fetch_project(params[:project_id]).editors) }
  # GET /workspaces/1
  # rubocop:disable Metrics/AbcSize Seeing if I can sneak this past Matt
  def show
    # Rails.logger.debug params
    @workspace = Kaiju::WorkspaceJson.as_json(
      params[:id], request.base_url, project_id: params[:project_id], user_id: current_user.id
    )
    @project = Kaiju::ProjectJson.as_json(params[:project_id], request.base_url, user_id: current_user.id)
    @user = Kaiju::UserJson.as_json(current_user.id, request.base_url)

    respond_to do |format|
      format.html
      format.json { render json: JSON.pretty_generate(@workspace) }
    end
  end

  # GET /workspaces
  def index
    Rails.logger.debug params

    render json: Kaiju::WorkspaceJson.workspaces_to_json(
      params[:project_object], request.base_url, user_id: current_user.id
    )
  end

  # POST /workspaces
  def create
    Rails.logger.debug params

    data = params.fetch(:workspace, {})

    workspace = new_workspace_from_hash(params[:project_object], data)

    render status: 201, json: Kaiju::WorkspaceJson.to_json(
      workspace.id, request.base_url, project_id: params[:project_id], user_id: current_user.id
    )
  end
  # rubocop:enable Metrics/AbcSize

  # PUT /workspace/1/name
  def name
    rename_workspace(params[:workspace_object], params)

    head :ok
  end

  # PUT /workspace/1/undo
  def undo
    render status: 201, json: JSON.pretty_generate(component_id: params[:workspace_object].undo_change)
  end

  # Put /workspace/1/redo
  def redo
    render status: 201, json: JSON.pretty_generate(component_id: params[:workspace_object].redo_change)
  end

  # GET /workspace/1/collaboration_invitation
  def collaboration_invitation
    invtation = Kaiju::InvitationFactory.new_workspace_invitation(params[:project_id], params[:id], current_user.id)
    render json: Kaiju::InvitationJson.to_json(invtation.id, request.base_url)
  end

  # GET /workspace/1/preview
  def preview
    workspace_object = params[:workspace_object]

    @ast = workspace_object.ast
    @title = workspace_object.name.value
    @author = Kaiju::User.by_id(workspace_object.author.value)
    respond_to do |format|
      format.html { render layout: 'preview' }
    end
  end

  # GET /workspace/1/attributes
  def attributes
    @ast = params[:workspace_object].ast
    respond_to do |format|
      format.html { render layout: 'attributes' }
    end
  end

  # GET /workspace/1/preview
  def code
    code = Kaiju::WorkspaceCode.generate_code(params[:workspace_object].ast.deep_symbolize_keys)
    formatter = Rouge::Formatters::HTML.new
    lexer = Rouge::Lexers::JSX.new
    @code = formatter.format(lexer.lex(code))

    respond_to do |format|
      format.html { render layout: 'code' }
      format.js { send_data @code, filename: 'code.jsx' }
    end
  end

  # GET /workspace/1/ast
  def ast
    render json: Kaiju::WorkspaceJson.ast_to_json(params[:id])
  end

  # DELETE /workspace/1
  def destroy
    Rails.logger.debug params

    params[:workspace_object].inactivate

    head :ok
  end

  def activate
    params[:project_object].activate
    head :ok
  end
end
