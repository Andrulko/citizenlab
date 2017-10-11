class Api::V1::GroupsController < ApplicationController

  def index
  	@groups = policy_scope(Group).all
  	render json: @groups
  end

  def show
  	authorize @group
    render json: @group, serializer: Api::V1::GroupSerializer # also include?
  end

  def by_slug
    @group = Group.find_by!(slug: params[:slug])
    authorize @group
    show
  end

  # insert
  def create
    @group = Group.new(permitted_attributes(Group))
    authorize @group
    if @group.save
      render json: @group.reload, status: :created # also include?
    else
      render json: { errors: @group.errors.details }, status: :unprocessable_entity
    end
  end

  # patch
  def update
  	authorize @group # ?? (added by me)
    if @group.update(permitted_attributes(Group))
      render json: @group.reload, status: :ok
    else
      render json: { errors: @group.errors.details }, status: :unprocessable_entity
    end
  end

  # delete
  def destroy
  	authorize @group # ?? (added by me)
    group = @group.destroy
    if group.destroyed?
      head :ok
    else
      head 500
    end
  end

end
