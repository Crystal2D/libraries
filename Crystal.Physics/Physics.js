class Physics
{
    static simulationMode = 0;
    static gravity = new Vector2(0, -9.8);

    static Init ()
    {
        PlayerLoop.onAfterFixedUpdate.Add(() => { if (this.simulationMode === 0) this.Simulate(); });
        PlayerLoop.onAfterUpdate.Add(() => { if (this.simulationMode === 1) this.Simulate(); });
    }

    static Simulate ()
    {
        const bodies = Rigidbody.instances.filter(item => item.gameObject.activeInHierarchy && item.simulated);
        const colliders = Collider.instances.filter(item => item.isActiveAndEnabled);

        for (let i = 0; i < colliders.length; i++)
        {
            if (colliders[i].attachedRigidbody != null) continue;

            const boundsA = colliders[i].bounds;
            boundsA.center = colliders[i].transform.position;
            boundsA.size = colliders[i].size.Duplicate();
        }

        for (let i = 0; i < bodies.length; i++)
        {
            const body = bodies[i];

            // body.linearVelocity = Vector2.Scale(this.gravity, body.gravityScale * Time.fixedDeltaTime);

            if (body.position == null) body.position = body.transform.position;

            body.position = Vector2.Add(
                body.transform.position,
                body.linearVelocity
            );

            const bodCols = body.GetAttachedColliders();

            for (let i = 0; i < bodCols.length; i++)
            {
                const boundsA = bodCols[i].bounds;
                boundsA.size = bodCols[i].size.Duplicate();

                for (let j = 0; j < colliders.length; j++)
                {
                    if (colliders[j].attachedRigidbody === body) continue;

                    const boundsB = colliders[j].bounds;

                    if (!boundsA.Intersects(boundsB)) continue;

                    const velocity = Vector2.Subtract(body.position, body.transform.position);

                    if (velocity.x < 0 && boundsA.min.x <= boundsB.max.x && boundsA.min.x - velocity.x > boundsB.max.x)
                    {
                        body.linearVelocity.x = 0;
                        body.position.x = boundsB.max.x + boundsA.extents.x;
                    }
                    else if (velocity.x > 0 && boundsA.max.x >= boundsB.min.x && boundsA.max.x - velocity.x < boundsB.min.x)
                    {
                        body.linearVelocity.x = 0;
                        body.position.x = boundsB.min.x - boundsA.extents.x;
                    }

                    if (velocity.y < 0 && boundsA.min.y <= boundsB.max.y && boundsA.min.y - velocity.y > boundsB.max.y)
                    {
                        body.linearVelocity.y = 0;
                        body.position.y = boundsB.max.y + boundsA.extents.y;
                    }
                    else if (velocity.y > 0 && boundsA.max.y >= boundsB.min.y && boundsA.max.y - velocity.y < boundsB.min.y)
                    {
                        body.linearVelocity.y = 0;
                        body.position.y = boundsB.min.y - boundsA.extents.y;
                    }
                }

                boundsA.center = body.position.Duplicate();
            }

            body.transform.position = body.position;

            // const boundsA = colliders[i].bounds.Duplicate();
            // boundsA.center = colliders[i].transform.position;

            // for (let j = 1; j < colliders.length; j++)
            // {
            //     if (j === i) continue;

            //     const boundsB = colliders[j].bounds.Duplicate();
            //     boundsB.center = colliders[j].transform.position;

            //     if (!boundsA.Intersects(boundsB)) continue;

            //     const pos = colliders[i].transform.position;

            //     // if (boundsA.max.x >= boundsB.min.x && boundsA.center.x <= boundsB.min.x) pos.x = boundsB.min.x - boundsA.extents.x;
            //     // else if (boundsA.min.x <= boundsB.max.x && boundsA.center.x >= boundsB.max.x) pos.x = boundsB.max.x + boundsA.extents.x;
            //     // else if (boundsA.max.y >= boundsB.min.y && boundsA.center.y <= boundsB.min.y) pos.y = boundsB.min.y - boundsA.extents.y;
            //     // else if (boundsA.min.y <= boundsB.max.y && boundsA.center.y >= boundsB.max.y) pos.y = boundsB.max.y + boundsA.extents.y;

            //     colliders[i].transform.position = pos;
            // }
        }
    }
}

Physics.Init();