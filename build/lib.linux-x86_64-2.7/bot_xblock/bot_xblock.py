"""TO-DO: Write a description of what this XBlock is."""

import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer, List
from xblock.fragment import Fragment

from django.template import Context, Template

from xblockutils2.studio_editable import StudioContainerXBlockMixin


class BotXBlock(StudioContainerXBlockMixin, XBlock):
    """
    Create container for making one nod of bot-friendly course
    """

    has_children = True

    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.

    # TO-DO: delete count, and define your own fields.
    count = Integer(
        default=0, scope=Scope.user_state,
        help="A simple counter, to show something happening",
    )

    theoretical_part = Integer(help="Xblocks for theoretical part", default=0,
                               scope=Scope.settings)
    question_part = Integer(help="Xblocks for question part", default=0,
                            scope=Scope.settings)
    positive_part = Integer(help="Xblocks for positive part", default=0,
                            scope=Scope.settings)
    negative_part = Integer(help="Xblocks for negative part", default=0,
                            scope=Scope.settings)

    def _is_studio(self):
        studio = False
        try:
            studio = self.runtime.is_author_mode
        except AttributeError:
            pass
        return studio

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def _render_template(self, ressource, **kwargs):
        template = Template(self.resource_string(ressource))
        context = dict({},**kwargs)
        html = template.render(Context(context))
        return html

    def render_children(self, context, fragment, can_reorder=True, can_add=False):
        """
        Renders the children of the module with HTML appropriate for Studio. If can_reorder is
        True, then the children will be rendered to support drag and drop.
        """
        xblocks = []

        for child_id in self.children:
            child = self.runtime.get_block(child_id)
            if can_reorder:
                context['reorderable_items'].add(child.scope_ids.usage_id)
            rendered_child = child.render('author_view' if hasattr(child, 'author_view') else 'student_view', context)
            fragment.add_frag_resources(rendered_child)

            xblocks.append({
                'id': child.location.to_deprecated_string(),
                'content': rendered_child.content
            })
        print self.theoretical_part, self.question_part, self.positive_part, self.negative_part
        print len(xblocks[:self.theoretical_part])
        print len(xblocks[self.theoretical_part:][:self.question_part])
        print len(xblocks[self.theoretical_part+self.question_part:][:self.positive_part])
        print len(xblocks[self.theoretical_part+self.question_part+self.positive_part:][:self.negative_part])
        fragment.add_content(self._render_template("static/html/studio_children.html", **{
                    'items_theory': xblocks[:self.theoretical_part],
                    'items_question': xblocks[self.theoretical_part:][:self.question_part],
                    'positive_items': xblocks[self.theoretical_part+self.question_part:][:self.positive_part],
                    'negative_items': xblocks[self.theoretical_part+self.question_part+self.positive_part:],
                    'xblock_context': context,
                    'can_add': can_add,
                    'can_reorder': can_reorder,
                    }))

    # TO-DO: change this view to display your data your own way.
    def student_view(self, context=None):
        """
        The primary view of the BotXBlock, shown to students
        when viewing courses.
        """
        if self._is_studio():  # studio view
            fragment = Fragment(self._render_template('static/html/studio.html'))
            # fragment.add_css(self.resource_string('static/css/password-container.css'))
            return fragment
        html = self.resource_string("static/html/bot_xblock.html")
        frag = Fragment(html.format(self=self))
        frag.add_css(self.resource_string("static/css/bot_xblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/bot_xblock.js"))
        frag.initialize_js('BotXBlock')
        return frag

    def studio_view(self, context=None):
        """This is the view displaying xblock form in studio."""
        fragment = Fragment()
        fragment.content = self._render_template('static/html/studio_edit.html', **context)
        fragment.add_javascript(self.resource_string("static/js/src/studio_edit.js"))
        fragment.initialize_js('BotContainerStudio')
        return fragment

    def author_edit_view(self, context):
        """We override this view from StudioContainerXBlockMixin to allow
        the addition of children blocks."""
        fragment = Fragment()
        self.render_children(context, fragment, can_reorder=True, can_add=True)
        fragment.add_javascript(self.resource_string("static/js/src/studio.js"))
        fragment.add_css(self.resource_string("static/css/studio.css"))
        fragment.initialize_js('BotXBlockStudio')
        return fragment

    @XBlock.json_handler
    def xblock_move(self, data, suffix=''):
        print data
        print self.question_part
        print self.theoretical_part
        print '*'*50
        self.theoretical_part = data['theoretical_part']
        self.question_part = data['question_part']
        self.positive_part = data['positive_part']
        self.negative_part = data['negative_part']
        self.count += 1
        print self.question_part
        print self.theoretical_part
        print self.count
        return 'ok'

    # TO-DO: change this handler to perform your own actions.  You may need more
    # than one handler, or you may not need any handlers at all.
    @XBlock.json_handler
    def increment_count(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """
        # Just to show data coming in...
        assert data['hello'] == 'world'

        self.count += 1
        return {"count": self.count}

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("BotXBlock",
             """<bot_xblock/>
             """),
            ("Multiple BotXBlock",
             """<vertical_demo>
                <bot_xblock/>
                <bot_xblock/>
                <bot_xblock/>
                </vertical_demo>
             """),
        ]
