<section class="comment">
	
	<header class="comment__header">
		
		<div class="comment__author">
			<img ng-src="comment.author.picture" />
			<span class="comment__author__name">{{ comment.author.fullName }}</span>
		</div>

		<time class="comment__time" datetime="{{ comment.creationTime | date:'yyyy-MM-ddTHH:mm:ssZ' }}" data-datetime-for-humans="{{ comment.creationTime | date:'yyyy/MM/dd, HH:mm:ss' }}">{{ comment.author.creationTime | forNow:'vi U' }} temu</span>
	</header>

	<div class="comment__content">
		
		<p>{{ comment.content }}</p>

	</div>

</section>