<section class="gallery">
	<ul class="gallery__pictures horizontal">
		<li class="gallery__picture" ng-repeat="picture in pictures">
			<img ng-src="/static/images/{{ picture.filename }}" alt="" />
		</li>
	</ul>	
</section>
