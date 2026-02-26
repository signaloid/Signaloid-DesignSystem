import { Meta, StoryObj } from '@storybook/angular';

export default {
	title: 'Typography/Global HTML',
	render: (args: any) => ({
		props: args,
		template: `
			<header>
				<h1>Typography Test Page</h1>
				<p>
					This page is designed to showcase a variety of typography styles using HTML. It includes headings,
					paragraphs, lists, code blocks, blockquotes, and more.
				</p>
			</header>

			<section>
				<h2>Headings</h2>
				<h1>Heading 1</h1>
				<h2>Heading 2</h2>
				<h3>Heading 3</h3>
				<h4>Heading 4</h4>
				<h5>Heading 5</h5>
				<h6>Heading 6</h6>
			</section>

			<section>
				<h2>Paragraphs and Text Formatting</h2>
				<p>
					This is a standard paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. You can use
					<strong>strong text</strong>, <em>italic text</em>, and <u>underlined text</u> to emphasize content.
				</p>
				<p>
					Highlighted text can be done with the <mark>mark tag</mark>, and <del>deleted text</del> is shown like this.
				</p>
			</section>

			<section>
				<h2>Lists</h2>
				<h3>Unordered List</h3>
				<ul>
					<li>List Item 1</li>
					<li>List Item 2</li>
					<li>List Item 3</li>
				</ul>

				<h3>Ordered List</h3>
				<ol>
					<li>First item</li>
					<li>Second item</li>
					<li>Third item</li>
				</ol>

				<h3>Description List</h3>
				<dl>
					<dt>Term 1</dt>
					<dd>Description for term 1.</dd>
					<dt>Term 2</dt>
					<dd>Description for term 2.</dd>
				</dl>
			</section>

			<section>
				<h2>Code and Preformatted Text</h2>
				<p>Inline code example: <code>console.log('Hello, World!');</code></p>
			</section>

			<section>
				<h2>Blockquotes</h2>
				<blockquote>
					"The only limit to our realization of tomorrow is our doubts of today." – Franklin D. Roosevelt
				</blockquote>
			</section>

			<section>
				<h2>Additional Typography</h2>
				<p>
					This is a paragraph that might represent small or large text depending on your global styles.
				</p>
				<p>
					You can use <abbr title="HyperText Markup Language">HTML</abbr> abbreviations to provide extra context.
				</p>
				<p>Here is some <s>strikethrough text</s>.</p>
				<p>
					Superscript example: 10<sup>th</sup> and subscript example: H<sub>2</sub>O.
				</p>
			</section>

			<footer>
			<p>
				<a href="https://www.example.com">Visit our site</a> for more typography examples.
			</p>
			</footer>
		`,
	}),
} as Meta;

export const GlobalHTML: StoryObj = {
	args: {},
};
