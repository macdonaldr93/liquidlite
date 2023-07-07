import {compile} from '@/compile';

describe('compile()', () => {
  it('allows generic type for strict variables', () => {
    const template = `<p>Hello, {{ person.name }}!</p>`;
    const variables = {
      person: {
        name: 'Ryan',
        height: 10,
      },
      foo: 'bar',
    };

    interface LiquidContext {
      person: {
        name: string;
        height: number;
      };
      foo: string;
    }

    const output = compile<LiquidContext>(template, variables);

    expect(output).toBe('<p>Hello, Ryan!</p>');
  });

  describe('processVariables()', () => {
    it('renders a variable', () => {
      const template = `<p>Hello, {{ name }}!</p>`;
      const variables = {
        name: 'Ryan',
      };

      const output = compile(template, variables);

      expect(output).toBe('<p>Hello, Ryan!</p>');
    });

    it('renders a variable without spaces', () => {
      const template = `<p>Hello, {{name}}!</p>`;
      const variables = {
        name: 'Ryan',
      };

      const output = compile(template, variables);

      expect(output).toBe('<p>Hello, Ryan!</p>');
    });

    it('renders an object path variable', () => {
      const template = `<p>Hello, {{person.name}}!</p>`;
      const variables = {
        person: {
          name: 'Ryan',
        },
      };

      const output = compile(template, variables);

      expect(output).toBe('<p>Hello, Ryan!</p>');
    });

    it("renders nothing if the path isn't in object", () => {
      const template = `<p>Hello, {{person.weight}}!</p>`;
      const variables = {
        person: {
          name: 'Ryan',
        },
      };

      const output = compile(template, variables);

      expect(output).toBe('<p>Hello, !</p>');
    });
  });

  describe('processControlFlow()', () => {
    it('renders content when the condition is true', () => {
      const template = `<div>
{% if x > 10 %}
  <h1>The value of x is {{ x }}.</h1>
{% endif %}
<p>Hello, {{ name }}!</p>
</div>
    `;

      const variables = {
        x: 15,
        name: 'Alice',
      };

      const output = compile(template, variables);

      expect(output).toBe(`<div>

  <h1>The value of x is 15.</h1>

<p>Hello, Alice!</p>
</div>`);
    });

    it('skips rendering content when the condition is false', () => {
      const template = `<div>
{% if x < 10 %}
  <h1>The value of x is {{ x }}.</h1>
{% endif %}
  <p>Hello, {{ name }}!</p>
</div>
    `;

      const variables = {
        x: 15,
        name: 'Alice',
      };

      const output = compile(template, variables);

      expect(output).toBe(`<div>



  <p>Hello, Alice!</p>
</div>`);
    });

    it('renders the else content when the condition is false', () => {
      const template = `<div>
{% if x < 10 %}
  <h1>The value of x is {{ x }}.</h1>
{% else %}
  <h1>The value of x is not {{ x }}.</h1>
{% endif %}
  <p>Hello, {{ name }}!</p>
</div>
    `;

      const variables = {
        x: 15,
        name: 'Alice',
      };

      const output = compile(template, variables);

      expect(output).toBe(`<div>



  <h1>The value of x is not 15.</h1>

  <p>Hello, Alice!</p>
</div>`);
    });

    it('renders content from object path variable when the condition is true', () => {
      const template = `<div>
{% if variant.price > 10 %}
  <h1>The value of x is {{ variant.price }}.</h1>
{% endif %}
<p>Hello, {{ name }}!</p>
</div>
    `;

      const variables = {
        variant: {
          price: 1500,
        },
        name: 'Alice',
      };

      const output = compile(template, variables);

      expect(output).toBe(`<div>

  <h1>The value of x is 1500.</h1>

<p>Hello, Alice!</p>
</div>`);
    });
  });
});
