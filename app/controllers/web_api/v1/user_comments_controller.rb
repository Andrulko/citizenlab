class WebApi::V1::UserCommentsController < ApplicationController

  def index
    @comments = policy_scope(Comment)
      .where(author_id: params[:user_id])

    @ideas = policy_scope(Idea)
      .where(id: @comments)
      .page(params.dig(:page, :number))
      .per(params.dig(:page, :size))

    @comments = @comments
      .includes(:idea)
      .left_outer_joins(:idea)
    @comments = @comments.order('ideas.published_at DESC, comments.created_at DESC')

    render json: @comments, include: ['idea']
  end


  private

  def secure_controller?
    false
  end

end
