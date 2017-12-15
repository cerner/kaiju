class ComponentsController < ApplicationController
  include ::ComponentsHelper
  before_action { fetch_workspace(params[:workspace_id]) }
  before_action { fetch_component(params[:id]) }
  before_action(only: %i[show]) { current_user.add_recent_workspace(params[:project_id], params[:workspace_id]) }
  before_action(except: %i[show attributes]) { authorize(params[:workspace_object].editors) }
  # GET /projects/1/workspaces/1/components/1
  def show # rubocop:disable Metrics/AbcSize
    # Rails.logger.debug params
    component = params[:component_object]

    @component = Kaiju::ComponentJson.as_json(
      component.id, request.base_url,
      project_id: params[:project_id], workspace_id: params[:workspace_id], user_id: current_user.id
    )

    respond_to do |format|
      format.html
      format.json { render json: JSON.pretty_generate(@component) }
    end
  end

  # PATCH/PUT /projects/1/workspaces/1/components/1
  def update # rubocop:disable Metrics/AbcSize
    component = params[:component_object]

    data = params.fetch(:component, {})

    update_component(params[:workspace_object], component, data)

    render json: Kaiju::ComponentJson.to_json(
      component.id, request.base_url,
      project_id: params[:project_id], workspace_id: params[:workspace_id], user_id: current_user.id
    )
  end

  # DELETE /projects/1/workspaces/1/components/1
  def destroy
    Rails.logger.debug params

    component = params[:component_object]

    component.inactivate

    head :ok
  end

  def attributes
    @ast = params[:component_object].ast
    respond_to do |format|
      format.html { render layout: 'attributes' }
    end
  end
end
