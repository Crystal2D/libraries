class Rigidbody extends Component
{
    static instances = [];

    #colliders = [];

    simulated = true;
    mass = 1;
    gravityScale = 0
    linearDamping = 1;
    linearVelocity = Vector2.zero;

    position = null;

    get linearVelocityX ()
    {
        return this.linearVelocity.x;
    }

    set linearVelocityX (value)
    {
        this.linearVelocity.x = value;
    }

    get linearVelocityY ()
    {
        return this.linearVelocity.y;
    }

    set linearVelocityY (value)
    {
        this.linearVelocity.y = value;
    }

    get attachedColliderCount ()
    {
        return this.#colliders.length;
    }

    get gameObject ()
    {
        return super.gameObject;
    }

    set gameObject (value)
    {
        super.gameObject = value;
        
        const colliders = this.GetComponents("Collider");
        
        for (let i = 0; i < colliders.length; i++) this.AttachCollider(colliders[i]);
    }

    constructor ()
    {
        super();

        Rigidbody.instances.push(this);
    }

    AttachCollider (collider)
    {
        if (this.#colliders.indexOf(collider) >= 0) return;

        this.#colliders.push(collider);
    }

    DetachCollider (collider)
    {
        const index = this.#colliders.indexOf(collider);

        if (index < 0) return;

        this.#colliders.splice(index, 1);
    }

    GetAttachedColliders ()
    {
        return [...this.#colliders];
    }
}