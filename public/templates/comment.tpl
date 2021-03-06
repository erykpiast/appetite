<section
	class="comment"
	ng-class="{
		'offer__comment': !comment.response,
		'offer__comment--response' : !!comment.response && !comment.response.accepted,
		'offer__comment--response--accepted': !!comment.response.accepted,
		'offer__comment--offer-author-comment': !comment.response && (comment.author.id === offerAuthorId)
	}">
	
	<header class="comment__header">
		<div
			class="comment__author"
			ui-sref="user.details({ id: comment.author.id })">
			<div class="comment__author__avatar">
				<img
					ng-src="/images/{{ comment.author.avatar.filename }}"
					height="40"
					width="40" />
			</div>
			<span class="comment__author__name">
				{{ comment.author.fullName }}
			</span>
		</div>

		<time
			class="comment__time"
			datetime="{{ comment.createdAt | date:'yyyy-MM-ddTHH:mm:ssZ' }}"
			data-datetime-for-humans="{{ comment.createdAt | date:'yyyy/MM/dd, HH:mm:ss' }}">
			{{ comment.createdAt | forNow:'vi U' }} {{ i18n.common.ago }}
		</time>
	</header>

	<div class="comment__content">
		<p>{{ comment.content }}</p>

		<button
			class="offer__comment--response__accept"
			ng-if="showOwnerFeatures() && !!comment.response && !comment.response.accepted"
			ng-click="responseAcceptHandler({ response: comment.response })">
			{{ i18n.offer.acceptResponse }}
		</button>
	</div>

	<div class="comment__nav">
		<button
			class="comment__nav__answer button--plain button--ico--reply"
			ng-if="showUserFeatures()"
			ng-click="answerTo(comment)">
			<span class="wrapper">{{ i18n.comments.answerTo }}</span>
		</button>
	</div>
</section>