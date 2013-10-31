<section ng-class="comment {{ comment.response !== 0 ? 'response' : '' }}">
	
	<header class="comment__header">
		
		<div class="comment__author">
			<img ng-src="/static/images/{{ comment.author.avatar.filename }}" height="40" width="40" />
			<span class="comment__author__name">{{ comment.author.fullName }}</span>
		</div>

		<time class="comment__time" datetime="{{ comment.createdAt | date:'yyyy-MM-ddTHH:mm:ssZ' }}" data-datetime-for-humans="{{ comment.createdAt | date:'yyyy/MM/dd, HH:mm:ss' }}">{{ comment.createdAt | forNow:'vi U' }} temu</span>
	</header>

	<div class="comment__content">
		
		<p>{{ comment.content }}</p>

	</div>

</section>