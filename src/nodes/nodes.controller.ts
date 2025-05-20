import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Controller()
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @MessagePattern('createNode')
  create(@Payload() createNodeDto: CreateNodeDto) {
    return this.nodesService.create(createNodeDto);
  }

  @MessagePattern('findAllNodes')
  findAll() {
    return this.nodesService.findAll();
  }

  @MessagePattern('findOneNode')
  findOne(@Payload() id: number) {
    return this.nodesService.findOne(id);
  }

  @MessagePattern('updateNode')
  update(@Payload() updateNodeDto: UpdateNodeDto) {
    return this.nodesService.update(updateNodeDto.id, updateNodeDto);
  }

  @MessagePattern('removeNode')
  remove(@Payload() id: number) {
    return this.nodesService.remove(id);
  }
}
