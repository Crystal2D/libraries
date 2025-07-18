class Collider extends Behavior
{
    static instances = [];

    #body = null;

    size = Vector2.one;
    bounds = new Bounds();

    get gameObject ()
    {
        return super.gameObject;
    }

    set gameObject (value)
    {
        super.gameObject = value;
        
        const body = this.GetComponent("Rigidbody");

        if (body != null) this.attachedRigidbody = body;
    }

    get attachedRigidbody ()
    {
        return this.#body;
    }

    set attachedRigidbody (value)
    {
        this.#body?.DetachCollider(this);
        this.#body = value;
        this.#body.AttachCollider(this);
    }

    constructor ()
    {
        super();

        Collider.instances.push(this);
    }
}