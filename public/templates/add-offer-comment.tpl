<div class="add-offer-comment" ng-class="className">
	<app-add-comment
		comment="comment"
		comment-parent="commentParent"
		on-submit="addComment(comment)"
		show-owner-features="showOwnerFeatures()"
		author="author">
		<button
			class="add-offer-comment__response"
			ng-if="!comment.parent && !showOwnerFeatures()"
			ng-click="addResponse()">
			{{ i18n.offer.response }}
		</button>
	</app-add-comment>
</div>